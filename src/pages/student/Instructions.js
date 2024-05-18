import React, { useEffect, useState } from 'react'
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const Instructions = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const student = localStorage.getItem("student");
        if (!student) {
            navigate("/student-login")
        }
    })
    const startTestHandler = () => {
        navigate("/test");
    };

    return (
        <>

            <div className="container border h-100 animate__animated animate__fadeInRight mt-4 bg-white">
                <div className="row">
                    <div className="col d-flex justify-content-center mt-4">
                        <div className="fw-bolder">
                            <MdOutlineIntegrationInstructions
                                style={{ height: "30px", width: "30px" }}
                            ></MdOutlineIntegrationInstructions>
                        </div>
                        <div className="mx-3 fw-bolder ">
                            <p style={{ height: "30px" }}>Instructions</p>
                        </div>
                    </div>
                </div>
                <hr className="feautrette-divider"></hr>
                <div className="container border ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                    in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                    qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                </div>
                <div className="text-center">
                    <button
                        type="button"
                        className="btn btn-outline-info m-2 fw-bolder"
                        onClick={startTestHandler}
                    >
                        Start test
                    </button>
                </div>
            </div>
        </>
    )
}

export default Instructions