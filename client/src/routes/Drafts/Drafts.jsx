import React, { useState, useEffect, useContext } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AnimatedComponent from "../../AnimatedComponent";
import RecentSkeleton from "../../components/Skeleton/RecentSkeleton";
import { transferData, takeData } from "../../parts/Dashboard/Dashboard";
import { Link } from "react-router-dom";

let userId = "6448cd7e09f1d7a9cc85ba1e";
function Drafts() {
  // State to save drafts from API call
  const [drafts, setDrafts] = useState([]);
  // State to set the Loading skeleton
  const [loading, setLoading] = useState(true);

  // using the useContext to set the draftdata into the setDraftData function for newDSr.
  const { setDraftData } = useContext(transferData);
  const { setIsUse } = useContext(takeData);

  function handleUse(index) {
    setDraftData(drafts[index]);
    setIsUse(true);
  }

  // Fetching drafts data from API using Async
  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://new-web-app.onrender.com/users/draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userId }),
        }
      );
      const data = await response.json();
      setDrafts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  // Deleting Drafts
  async function deleteDraft(id) {
    try {
      const response = await fetch(
        "https://new-web-app.onrender.com/draftdelete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ draft: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was an error deleting the data:", error);
    }
  }

  // Call deleteDraft and then fetchDrafts in sequence
  async function handleDelete(id) {
    try {
      await deleteDraft(id);
      verificationMsg();
      setTimeout(closeMsg, 3000);
      await fetchDrafts();
      // console.log("Deleted data:", deletedData);
      // do something with deletedData, such as update state or re-fetch data
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const [msg, setMsg] = useState(false);

  function verificationMsg() {
    setMsg(true);
  }

  function closeMsg() {
    setMsg(false);
  }

  // Mapping drafts in to React component
  const cardDraft = drafts.map((data, index) => {
    // formatting date and time from API data
    let date = new Date(data.date);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    // let hour = date.getHours();
    // let min = date.getMinutes();
    // let ampm = hour >= 12 ? "PM" : "AM";
    // hour = hour % 12;
    // hour = hour ? hour : 12; // the hour '0' should be '12'
    // min = min < 10 ? "0" + min : min;
    // let time = hour + ":" + min + " " + ampm;

    let monthArray = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    let dateOfCreation = day + " " + monthArray[month] + " " + year;

    return (
      <div key={data._id}>
        <div className="draft-card recents-card card">
          <div className="info">
            <div className="data date">
              <h4 className="heading-xs">Date of Creation</h4>
              <p className="para date">{dateOfCreation}</p>
            </div>

            <div className="data project-name">
              <h4 className="heading-xs">Project Name</h4>
              <p className="para para-bold">{data.projectName}</p>
            </div>

            <div className="data hrs-worked">
              <h4 className="heading-xs">Hours Worked</h4>
              <p className="para">{data.hoursWorked} hrs</p>
            </div>

            <div className="data client-manager">
              <h4 className="heading-xs">Client Manager</h4>
              <p className="para">{data.clientManager}</p>
            </div>
          </div>

          <div className="cta">
            <Link
              to="/"
              className="btn btn-dark btn-view"
              onClick={(e) => handleUse(index)}
            >
              Use
            </Link>
            <button
              className="btn btn-dark btn-error"
              onClick={(e) => handleDelete(data._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    // Adding animated component to make the route change animated -- Adarsh(19-Apr)
    <HelmetProvider>
      <AnimatedComponent>
        <Helmet>
          <title>Your Saved Drafts | LeafLog-Quadrafort</title>
        </Helmet>
        <div className={`verification-cta ${msg ? "show-verification" : ""}`}>
          <h3 className="heading-xs">Draft Deleted Successfully! 🎉</h3>
        </div>
        <div className="recents">
          <h3 className="heading-s">Your Saved Drafts</h3>

          <div className="recents-card-container card-container">
            {cardDraft.length > 0 ? (
              <div className="scroll-parent">
                {loading
                  ? Array.from({ length: 10 }, (_, i) => (
                      <RecentSkeleton key={i} />
                    ))
                  : cardDraft}
              </div>
            ) : (
              <div className="blank-page">
                <h3 className="heading-s">
                  <i className="fa-solid fa-mug-hot"></i>
                  <br /> There is no saved Drafts. <br />
                  You can save the draft from the New DSR page!
                </h3>
              </div>
            )}
          </div>
        </div>
      </AnimatedComponent>
    </HelmetProvider>
  );
}

export default Drafts;
