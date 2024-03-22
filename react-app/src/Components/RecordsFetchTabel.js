import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentRecordTable(props) {
  const [booleans, setBooleans] = useState({
    hodId: false
  });
  useEffect(
    () => {
      // console.log(props);
      if (props.id && props.id.length === 5) {
        setBooleans(prevData => ({ ...prevData, hodId: true }));
      }
    },
    [props.id]
  );
  // remove the student
  async function removeStudent(studentData) {
    try {
      const response = await axios.put("http://localhost:8003/hod/removeStudent", {
        studentData: studentData,
        hodId: props.id
      });
      // console.log(response.data);
      if (response.data) {
        window.alert("Data Removed");
      }
    } catch (error) {
      console.log("Error in removing the student");
    }
    // console.log(studentData);
  }
  return (
    // <table style={{ borderCollapse: "collapse", margin: "auto", width: "70%", marginTop: "1.5rem" }}>
    //   <thead>
    //     <tr>
    //       <th >Name</th>
    //       <th >Regno</th>
    //       <th >Year</th>
    //       <th >Section</th>
    //       <th >Department</th>
    //       <th >Seeked-Date & Time</th>
    //       <th >Image</th>
    //       {booleans.hodId && <th >Remove</th>}
    //     </tr>
    //   </thead>
    <div className="justify-center md:flex md:flex-wrap md:justify-evenly">
      {props.data.map((data, index) => (
        <div
          key={index}
          className="w-11/12 mx-auto h-4/5 text-xs sm:text-sm md:h-full md:text-base p-2 flex  shrink m-3 bg-slate-100 md:w-2/5 border-gray-300 border-2 rounded-tl-xl rounded-br-xl transform transition-all duration-500 hover:scale-105 hover:bg-blue-300 shadow-xl dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-slate-100  text-slate-800 dark:text-slate-300 dark:hover:text-slate-800"
        >
          {/* Image Section */}
          <section className="w-4/12 md:w-2/5 flex justify-center items-center">
            <img
              src={data.studentImgUrl}
              className="h-3/4 w-3/4 md:h-4/5 md:w-4/5  rounded-md"
              alt={`${data.name} ${data.last_seeked} Seeked Img`}
            />
          </section>
          {/* Text Section */}
          <section className="w-3/4 text-center md:text-start flex justify-around items-center">
            <div>
              <h2 className="font-semibold">{data.name}</h2>
              <p className="">{data.regno}</p>
              <p className="">{data.year}</p>
              <p className="">{data.section}</p>
              <p className="">{data.major}</p>
              <p className="">{data.last_seeked}</p>
            </div>
          </section>
        </div>
      ))}
    </div>
    // <div>
    //   {props.data.map((data, index) => (
    //     <tr key={index}>
    //       <td >{data.name}</td>
    //       <td >{data.regno}</td>
    //       <td >{data.year}</td>
    //       <td >{data.section}</td>
    //       <td >{data.major}</td>
    //       <td >{data.last_seeked}</td>
    //       <td >
    //         <img
    //           src={data.studentImgUrl}
    //           style={{ height: "100px", width: "100px", paddingTop: "5px" }}
    //           alt={`${data.name} ${data.last_seeked} Seeked Img`}
    //         />
    //       </td>
    //       {booleans.hodId && (
    //         <td  onClick={() => removeStudent(data)}>
    //           Remove
    //         </td>
    //       )}
    //     </tr>
    //   ))}
    // </div>
    // </table>
  );
}



export default StudentRecordTable;
