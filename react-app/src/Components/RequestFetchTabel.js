import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

function RequestFetchTabel(props) {
  const [booleans, setBooleans] = useState({
    student: false,
    currentRequest: false,
    historyRequest: false
  });
  useEffect(
    () => {
      if (props.id.length === 8) {
        setBooleans(prevData => ({ ...prevData, student: true }));
      } else {
        props.historyRequestShow
          ? setBooleans(prevData => ({ ...prevData, historyRequest: true }))
          : setBooleans(prevData => ({ ...prevData, currentRequest: true }));
      }
    },
    [props.id, props.historyRequestShow]
  );
  const width = booleans.currentRequest ? { width: "50%" } : { width: "40%" };

  // request Accept
  async function requestAccept(regno, date, startTime, endTime) {
    // console.log(regno, "request Accept");
    try {
      const response = await axios.put("http://localhost:8002/faculty/requestAccept", {
        regno: regno,
        date: date,
        startTime: startTime,
        endTime: endTime
      });
      // console.log(response.data);
      if (response.data) {
        window.alert("Requested Accepted");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error in rejecting request", error);
    }
  }

  // request Reject
  async function requestReject(regno, date, startTime, endTime) {
    // console.log(regno, date, startTime, endTime, "request Reject");
    try {
      const response = await axios.put("http://localhost:8002/faculty/requestReject", {
        regno: regno,
        date: date,
        startTime: startTime,
        endTime: endTime
      });
      // console.log(response.data);
      if (response.data) {
        window.alert("Requested Rejected");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error in rejecting request", error);
    }
  }

  return (
    <table className="w-11/12 table-auto text-extraSmall md:text-base md:w-full mx-auto md:table-auto text-slate-800 dark:text-slate-400">
      {/*style={{ borderCollapse: "collapse", margin: "auto", width, marginTop: "1.5rem" }} */}
      <thead className="">
        <tr
          className=" bg-blue-500 text-white p-2 border-blue-500 border-2 dark:bg-slate-500 dark:border-slate-500 
        dark:text-slate-100 text-extraSmall font-medium md:text-basePlus "
        >
          <th className="p-0 md:p-2">Name</th>
          <th className="p-0 md:p-2">Regno</th>
          <th className="p-0 md:p-2">Reason</th>
          <th className="p-0 md:p-2">Date</th>
          <th className="p-0 md:p-2">Start Time</th>
          <th className="p-0 md:p-2">End Time</th>
          {booleans.student || booleans.historyRequest ? (
            <th className="p-0 md:p-2">Status</th>
          ) : (
            <>
              <th className="p-0 md:p-2">Accept</th>
              <th className="p-0 md:p-2">Reject</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {props.data.map((data, index) => (
          <tr key={index}>
            <td className="p-0 md:p-2 border-gray-400 border-2 text-center">{data.name}</td>
            <td className="p-0 md:p-2 border-gray-400 border-2 text-center">{data.regno}</td>
            <td className="p-0 md:p-2 border-gray-400 border-2 text-center">{data.reason}</td>
            <td className="p-0 md:p-2 border-gray-400 border-2 text-center">{data.date}</td>
            <td className="p-0 md:p-2 border-gray-400 border-2 text-center">{data.startTime}</td>
            <td className="p-0 md:p-2 border-gray-400 border-2 text-center">{data.endTime}</td>
            {booleans.student || booleans.historyRequest ? (
              <td
                className={`p-2 border-gray-400 border-2 text-center ${
                  data.status === "Acceptede"
                    ? "text-green-600"
                    : data.status === "Rejected"
                    ? "text-rose-600"
                    : "text-orange-600"
                }`}
              >
                {data.status}
              </td>
            ) : (
              <>
                <td
                  className="p-0 md:p-2 border-gray-400 border-2 text-center relative"
                  onClick={() => requestAccept(data.regno, data.date, data.startTime, data.endTime)}
                >
                  <div className="absolute inset-0 flex items-center justify-center ">
                    <TiTick className="cursor-pointer md:w-7 md:h-7 text-green-500" />
                  </div>
                </td>
                <td
                  className="p-0 md:p-2 border-gray-400 border-2 text-center relative"
                  onClick={() => requestReject(data.regno, data.date, data.startTime, data.endTime)}
                >
                  <div className="absolute inset-0 flex items-center justify-center ">
                    <RxCross2 className=" cursor-pointer md:w-7 md:h-7 text-red-500" />
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// const tableHeaderCellStyle = {
//   border: "1px solid #000",
//   padding: "5px",
//   backgroundColor: "#f2f2f2"
// };

// const tableCellStyle = {
//   border: "1px solid #000"
// };

export default RequestFetchTabel;
