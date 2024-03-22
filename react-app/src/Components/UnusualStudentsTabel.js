import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";

function UnusualStudentsTabel(props) {
  // remove the student
  async function removeUnusualSeekedStudent(data) {
    try {
      const response = await axios.put("http://localhost:8002/faculty/removeUnusualSeekedStudent", {
        data: data
      });
      //   console.log(data);
      if (response.data) {
        window.alert("Data Removed");
      } else {
        window.alert("erroe in removing data");
      }
      window.location.reload();
    } catch (error) {
      console.log("Error in removing the student", error);
    }
  }

  return (
    <div className=" flex flex-wrap justify-evenly ">
      {props.data.map((data, index) => (
        <div
          key={index}
          className="w-2/5 mx-auto h-16 text-xs sm:text-sm md:h-32 md:text-base  flex  shrink m-3 bg-slate-100 md:w-27 border-gray-300 border-2 rounded-tl-xl rounded-br-xl transform transition-all duration-500 hover:scale-105 hover:bg-blue-300 shadow-xl dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-slate-100  text-slate-800 dark:text-slate-300 dark:hover:text-slate-800"
        >
          {/* Image Section */}
          <section className="p-2 w-70 md:70 flex justify items-center">
            <img
              src={data.url}
              className="h-full w-full md:h-full md:w-70  rounded-md"
              alt={`${data.name} ${data.last_seeked} Seeked Img`}
            />
          </section>
          <section className="w-30 md:30 text-center  flex justify items-center">
            <p
              onClick={() => removeUnusualSeekedStudent(data)}
              className="hover:text-red-600 cursor-pointer scale-150 hover:scale-trash transition-transform duration-300"
            >
              <RiDeleteBin6Line className="" />
            </p>
          </section>
        </div>
      ))}
    </div>
    
  );
}

const tableHeaderCellStyle = {
  border: "1px solid #000",
  padding: "5px",
  backgroundColor: "#f2f2f2"
};

const tableCellStyle = {
  border: "1px solid #000"
};

export default UnusualStudentsTabel;
