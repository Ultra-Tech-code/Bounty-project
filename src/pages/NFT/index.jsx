import axios from "axios";
import React, { Fragment, useState } from "react";
import { useAccount } from "wagmi";

import "./nft.css";

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

const NFT = () => {
  const { address } = useAccount();
  const [protocol, setProtocol] = useState("ethereum");
  const [determinant, setDeterminant] = useState("address");
  const [searchAddress, setSearchAddress] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState(null)

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
        `https://ubiquity.api.blockdaemon.com/nft/v1/${protocol}/mainnet/assets?wallet_address=${address}`,
        config
      );
      setLoading(false);
      setResult(data?.data);
      //fetchImAGE();
    } else {
      setLoading(true);
      const { data } = await axios.get(
        `https://ubiquity.api.blockdaemon.com/nft/v1/${protocol}/mainnet/assets?wallet_address=${searchAddress}`,
        config
      );
      setLoading(false);
      setResult(data?.data);
      //fetchImAGE(data?.data);
    }
  };

  // const fetchImAGE = async () => {
  //     setLoading(true);
  //     const { data } = await axios.get(
  //       `https://ubiquity.api.blockdaemon.com/nft/v1/${protocol}/mainnet/media/${res?.image_url}`,
  //       config
  //     );
  //     setLoading(false);
  //     console.log(data?.data);
  // }
  const handleEvent = async (id) => {
    let resp = result.filter((txn) => txn.id === id);

    setShowModal(true);
    console.log(resp[0].events);
    setSelectedEvent(resp[0].events);
  };
  return (
    <Fragment>
      <div className="row">
        <div className="column2">
          <img src="/search-image.png" alt="banner" width="600px" />
        </div>

        <div className="column1">
          <h1>Curious about NFT???</h1>

          <form onSubmit={handleSubmit}>

            <div id="addr-input">
            <label for="inp" class="inp">
            <input type="text" onChange={(e) => setSearchAddress(e.target.value)}/>
            <span class="label">NFT </span>
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
            <th>Name</th>
            <th>Token Id</th>
            <th>Contract Address</th>
            <th>Image</th>
            {/* <th></th> */}
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
                  <td>
                    {res?.name?.slice(0, 30)}
                  </td>
                  <td>
                  {`${res?.token_id?.slice(0, 6)}...${res?.token_id.slice(-6)}`}
                  </td>
                  <td>
                  {`${res?.contract_address}`}
                  </td>
                  <td>
                    <img src={axios.get(`https://ubiquity.api.blockdaemon.com/nft/v1/${protocol}/mainnet/media/${res?.image_url}`, config)} alt="nft image" />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(!showModal)}
        style={customStyles}
        contentLabel="Events"
      >
        <div style={{ color: "#000" }}>
          <div>
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
              Events
            </h2>
            <button onClick={() => setShowModal(!showModal)}>
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div >
            <table>
              <thead>
                <tr>
                  <th>txn id </th>
                  <th>from</th>
                  <th>to</th>
                  <th>amount</th>
                  <th>denomination</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(selectedEvent) &&
                selectedEvent.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      Transaction has no event!
                    </td>
                  </tr>
                ) : (
                  selectedEvent?.slice(0, 5)?.map((event, index) => {
                    return (
                      <tr key={event.id}>
                        <td>
                          {`${event?.transaction_id.slice(0,6)}...${event?.transaction_id.slice(-6)}`}
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
      </Modal> */}
    </Fragment>
  );
};

export default NFT;
