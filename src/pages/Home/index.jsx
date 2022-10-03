import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";


import "./Home.css";

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

const Home = () => {
  const { address } = useAccount();
  const [protocol, setProtocol] = useState("ethereum");
  const [determinant, setDeterminant] = useState("address");
  const [searchAddress, setSearchAddress] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  let subtitle;

  let token = "bd1b4uvVUUl8KUHvGEscJT8K1C98kU8qSNnPFG2JcUPV0Hi";
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    console.log({ protocol, address });

    if (searchAddress.length === 18) {
    }

    const { data } = await axios.get(
      `https://ubiquity.api.blockdaemon.com/v1/${protocol}/mainnet/txs`,
      config
    );
    // https://ubiquity.api.blockdaemon.com/v1/{protocol}/{network}/account/{address} 
    setResult(data?.data);
    console.log(data?.data);
    setLoading(false);
  };

  const [selectedEvent, setSelectedEvent] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleEvent = async (id) => {
    let resp = result.filter((txn) => txn.id === id);

    setShowModal(true);
    console.log(resp[0].events);
    setSelectedEvent(resp[0].events);
  };


  const [wallet, setWallet] = useState(null)


  const getAddress = async() => {
    const {data} = await axios.get(`https://ubiquity.api.blockdaemon.com/v1/${protocol}/goerli/account/${address}`, config)

    console.log(data[0]);
    setWallet(data[0]);
  }

  useEffect(() => {
    getAddress()
    
  }, [])


  return (
    <Fragment>
      <div className="row">
        <div className="column2">
          <img src="/search-image.png" alt="banner" width="600px" />
        </div>


        <div>
          {wallet && (
            <>{wallet.comfirmed_balance} {" "} {wallet.currency.symbol}</>
          )}
          
        </div>

        <div className="column1">
          <h1>Details About Your Address</h1>

          <form onSubmit={handleSubmit}>
            <div id="dropanddetails">
              <div className="dropdown">
                <select
                  onChange={(e) => setProtocol(e.target.value)}
                  name=""
                  id=""
                  className="dropbtn"
                >
                  <option value={"ethereum"}>Ethereum</option>
                  <option value={"bitcoin"}>Bitcoin</option>
                  <option value={"solana"}>Solana</option>
                  <option value={"avalanche"}>Avalanche</option>
                  <option value={"algorand"}>Algorand</option>
                  <option value={"fantom"}>Fantom</option>
                  <option value={"polkadot"}>Polkadot</option>
                </select>

                <select
                  onChange={(e) => setDeterminant(e.target.value)}
                  name=""
                  id=""
                  className="dropbtn"
                >
                  <option value={"address"}>Address</option>
                  <option value={"block_id"}>Block ID</option>
                  <option value={"transaction_hash"}>Transaction Hah</option>
                </select>
                {/* <button onclick={() => setNetwork(true)} className="dropbtn">
                Network
              </button>

              {
                network && (
                    <div id="myDropdown" className="dropdown-content">
                        <a href="#">Solana</a>
                        <a href="#">Avalanche</a>
                        <a href="#">Alogrand</a>
                        <a href="#">Fantom</a>
                        <a href="#">Polkadot</a>
                    </div>

                )
              } */}
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
                  <td>{`${res?.block_id?.slice(0, 6)}...${res?.block_id.slice(
                    -6
                  )}`}</td>
                  <td>{res?.block_number}</td>
                  <td>
                    {res?.status?.charAt(0).toUpperCase() + res.status.slice(1)}
                  </td>
                  <td>{res?.confirmations}</td>
                  <td>{res?.num_events}</td>
                  <td>
                    <button onClick={() => handleEvent(res?.id)}>Event</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* </div> */}

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(!showModal)}
        style={customStyles}
        contentLabel="Events"
      >
        <div style={{color: "#000"}}>
          <div className="flex justify-between mb-2">
            <h2
              className="text-2xl"
              ref={(_subtitle) => (subtitle = _subtitle)}
            >
              Events
            </h2>
            <button onClick={() => setShowModal(!showModal)}>
              <AiOutlineClose size={24} />
            </button>
          </div>



          <div className="flex flex-col mt-2">
            <div className="mb-3 overflow-x-auto rounded-xl shadow-md">
              <div className="pt-2 align-middle inline-block min-w-full">
                <div className="overflow-hidden border-gray-200 rounded-xl">
                  <table className="w-full divide-y divide-gray-200 relative px-4">
                    <thead className="bg-dark_deep">
                      <tr>
                        <th
                          scope="col"
                          className="px-1 md:px-3 py-5 text-xs font-medium text-white_variant uppercase tracking-wider"
                        >
                          txn id
                        </th>
                        <th
                          scope="col"
                          className="px-2 md:px-4 py-5 text-left text-xs font-medium text-white_variant uppercase tracking-wider"
                        >
                          from
                        </th>
                        <th
                          scope="col"
                          className="md:px-3 px-1 py-5 text-left text-xs font-medium text-white_variant uppercase tracking-wider"
                        >
                          to
                        </th>
                        <th
                          scope="col"
                          className="md:px-3 px-1 py-5 text-left text-xs font-medium text-white_variant uppercase tracking-wider"
                        >
                          amount
                        </th>
                        <th
                          scope="col"
                          className="md:px-3 px-1 py-5 text-left text-xs font-medium text-white_variant uppercase tracking-wider"
                        >
                          denomination
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-300">
                      {Array.isArray(selectedEvent) &&
                      selectedEvent.length === 0 ? (
                        <tr className="mb-4">
                          <td
                            colSpan={7}
                            className="font-medium whitespace-nowrap text-center px-1 md:px-3 py-3"
                          >
                            Transaction has no event!
                          </td>
                        </tr>
                      ) : (
                        selectedEvent?.slice(0, 5)?.map((event, index) => {
                          return (
                            <tr className="mb-4" key={event.id}>
                              <td className="whitespace-nowrap truncate md:px-4 px-2 py-3">
                                {`${event?.transaction_id.slice(
                                  0,
                                  6
                                )}...${event?.transaction_id.slice(-6)}`}
                              </td>
                              <td className="text-sm truncate whitespace-nowrap md:px-3 px-1 py-3">
                                {`${event?.source.slice(
                                  0,
                                  9
                                )}...${event?.source.slice(-9)}`}
                              </td>
                              <td className="text-sm truncate whitespace-nowrap md:px-3 px-1 py-3">
                                {event?.type === "transfer"
                                  ? `${event?.destination.slice(
                                      0,
                                      9
                                    )}...${event?.destination.slice(-9)}`
                                  : "-"}
                              </td>
                              <td className="text-sm truncate whitespace-nowrap md:px-3 px-1 py-3">
                                {(event?.amount / 1e18).toFixed(6)}
                              </td>
                              <td className="text-sm truncate whitespace-nowrap md:px-3 px-1 py-3">
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
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Home;
