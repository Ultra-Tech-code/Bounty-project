import axios from "axios";
import React, { Fragment, useState } from "react";
import { useAccount } from "wagmi";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import "./Address.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Address = () => {
  const { address } = useAccount();
  const [protocol, setProtocol] = useState("ethereum");
  //const [determinant, setDeterminant] = useState("address");
  const [searchAddress, setSearchAddress] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [showModal, setShowModal] = useState(false);

  let subtitle;

  let token = "bd1b4uvVUUl8KUHvGEscJT8K1C98kU8qSNnPFG2JcUPV0Hi";
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };    

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchAddress === "") {
      setLoading(true);
      const { data } = await axios.get(
        `https://ubiquity.api.blockdaemon.com/v1/${protocol}/goerli/account/${address}/txs`,
        config
      );
      setResult(data?.data);
      setLoading(false);
    } else {
      setLoading(true);
      const { data } = await axios.get(
        `https://ubiquity.api.blockdaemon.com/v1/${protocol}/mainnet/account/${searchAddress}/txs`,
        config
      );
      setResult(data?.data);
      setLoading(false);
    }
  };

  const handleEvent = async (id) => {
    let resp = result.filter((txn) => txn.id === id);

    setShowModal(true);
    setSelectedEvent(resp[0].events);
  };

  return (
    <Fragment>
      <div className="row">
        <div className="column2">
          <img src="/search-image.png" alt="banner" width="600px" />
        </div>

        <div className="column1">
          <h1>Everything About Address!!!</h1>

          <form onSubmit={handleSubmit}>

            <div id="addr-input">
            <label for="inp" class="inp">
            <input type="text" onChange={(e) => setSearchAddress(e.target.value)}/>
            <span class="label">Address</span>
            <span class="focus-bg"></span>
             </label>
            </div>

            <div id="dropanddetails">
              <div className="dropdown">
                <select onChange={(e) => setProtocol(e.target.value)} className="dropbtn">
                  <option value={"ethereum"}>Ethereum</option>
                  <option value={"bitcoin"}>Bitcoin</option>
                  <option value={"solana"}>Solana</option>
                  <option value={"avalanche"}>Avalanche</option>
                  <option value={"algorand"}>Algorand</option>
                  <option value={"fantom"}>Fantom</option>
                  <option value={"polkadot"}>Polkadot</option>
                </select>
              </div>

              <button type="submit" id="fetchdata">
              {loading ? "Loading..." : "Get Details"}
                
              </button>
            </div>
          </form>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Block Id</th>
            <th>Block Number</th>
            <th>Status</th>
            <th>Confirmations</th>
            <th>No of event</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(result) && result.length === 0 ? (
            <tr className="mb-4">
              <td colSpan={7} className="">
                Input a valid address in the search field above!
              </td>
            </tr>
          ) : (
            result?.map((res, index) => {
              return (
                <tr key={index}>
                  <td>{`${res?.block_id}`}</td>
                  <td>{res?.block_number}</td>
                  <td>
                    {res?.status?.charAt(0).toUpperCase() + res.status.slice(1)}
                  </td>
                  <td>{res?.confirmations}</td>
                  <td>{res?.num_events}</td>
                  <td>
                    <button id="event-btn" onClick={() => handleEvent(res?.id)}>Event</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(!showModal)}
        style={customStyles}
        contentLabel="Events"
      >
        <div style={{ color: "#000" }}>
          <div>
            <h2 ref={(_subtitle) => (subtitle = _subtitle)} >
              Events
            </h2>
            <button onClick={() => setShowModal(!showModal)}>
              <AiOutlineClose size={24} />
            </button>
          </div>

          <div >
            <table >
              <thead >
                <tr>
                  <th > txn id </th>
                  <th > from </th>
                  <th > to </th>
                  <th > amount </th>
                  <th > denomination </th>
                </tr>
              </thead>
              <tbody> {Array.isArray(selectedEvent) &&
                selectedEvent.length === 0 ? (
                  <tr className="mb-4">
                    <td colSpan={7}> Transaction has no event! </td>
                  </tr>
                ) : (
                  selectedEvent?.slice(0, 5)?.map((event, index) => {
                    return (
                      <tr key={event.id}>
                        <td>
                          {`${event?.transaction_id.slice(0, 6)}...${event?.transaction_id.slice(-6)}`}
                        </td>
                        <td>
                          {`${event?.source.slice(0,9)}...${event?.source.slice(-9)}`}
                        </td>
                        <td>
                          {event?.type === "transfer" ? `${event?.destination.slice(0,9)}...${event?.destination.slice(-9)}`: "-"}
                        </td>
                        <td>
                          {(event?.amount / 1e18).toFixed(6)}
                        </td>
                        <td>
                          {event?.denomination}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Address;
