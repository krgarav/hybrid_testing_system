import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { questionSliceAction } from "store/test/test";
import { MdTimer } from "react-icons/md";
import Timer from "./timer";
import { PiFastForwardCircleBold } from "react-icons/pi";
import { BsXCircleFill } from "react-icons/bs";
import { FaClipboardQuestion } from "react-icons/fa6";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import QuestionSelector from "./questionSelector";
import { useNavigate } from "react-router-dom";
import { Button, } from "reactstrap";
import { Modal } from "react-bootstrap";
import ios from "../../assets/images/ios.png";
import { useAuth } from "context/authContext";
import { IMAGE_FETCH } from "helpers/url_helper";
import { toast } from "react-toastify";
import axios from "axios";
import { saveExamAnswers } from "helpers/test_helper";
import { success } from "toastr";
import io from 'socket.io-client';
import classes from "./testscreen.module.css"



const TestScreen = () => {
  const fullScreenRef = useRef(null);

  const [nextVisible, setNextVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [question, setQuestion] = useState([]);
  const [student] = useAuth();
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [timeFinish, setTimeFinish] = useState(false);
  const socket = useRef(null);
  let isAlertShown = false;




  useEffect(() => {
    const student = localStorage.getItem("student");
    if (!student) {
      navigate("/student-login")
    }
  })

  useEffect(() => {
    let a = JSON.parse(localStorage.getItem("student"))?.examSet[0];
    // console.log("time ---->", a[0].time)
    setQuestion(a);
  }, []);



  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("")
  const [submit, setSubmit] = useState({});
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState({ [currentQuestionIndex]: true });
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  // const [warningCount, setWarningCount] = useState(1);
  let warningCount1 = 0;
  let warningCount2 = 0;




  const submitQuestion = (ans) => {

    ans.userAnswer = answer;
    setAnswers({ ...answers, [currentQuestionIndex]: ans });
    setSubmit({ ...submit, [currentQuestionIndex]: true })
    setVisited({ ...visited, [currentQuestionIndex + 1]: true })
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setAnswer(answers[currentQuestionIndex + 1]?.userAnswer ? answers[currentQuestionIndex + 1]?.userAnswer : "")
    setNextVisible(false);

  }

  const submitLastQuestion = (ans) => {

    ans.userAnswer = answer;
    setAnswers({ ...answers, [currentQuestionIndex]: ans });
    setSubmit({ ...submit, [currentQuestionIndex]: true });


  }
  const handleSkipQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setVisited({ ...visited, [currentQuestionIndex + 1]: true })
    // setAnswer("")
    setAnswer(answers[currentQuestionIndex + 1]?.userAnswer ? answers[currentQuestionIndex + 1]?.userAnswer : "")
    setNextVisible(false);
  }

  const jumpQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setVisited({ ...visited, [index]: true })
    setAnswer(answers[index]?.userAnswer ? answers[index]?.userAnswer : "")
    setNextVisible(false);
  }




  const [selectedOption, setSelectedOption] = useState(null);



  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setNextVisible(true);
  };

  const handleAnswerChange = selectedAnswer => {
    setAnswer(selectedAnswer);
    setNextVisible(true);

  }

  const onFinalSubmitHandler = () => {
    setModalShow(true);
    // navigate("/finalsubmit");
  };

  const submigNavigate = async () => {
    console.log(answers);
    let questionId = [];
    let paperId;
    let answer = [];

    let student = JSON.parse(localStorage.getItem('student'));
    let studentId = student.studentId;
    paperId = student?.examSet[0][0].paperId;

    Object.values(answers).forEach(d => {
      questionId.push(d.questionId);
      answer.push(d.userAnswer);
    });

    setModalShow(false);
    let a = Object.keys(answers).length
    let v = Object.keys(visited).length
    let s = Object.keys(submit).length
    let ua = question?.length - v;
    let result = await saveExamAnswers({ paperId, questionId, answer, studentId })
    if (result?.success) {
      toast.success(result.message);
      localStorage.removeItem("student")
      navigate(`/finalsubmit/${s}/${v}/${ua}`);
    }
  }




  const handleKeyDown = (event) => {

    if (event.key == "Q") {
      toast("alert")
    }
    // Check for F12, Alt, or Tab keys
    if (
      event.key === 'F12' ||
      event.key === 'Alt' ||
      event.key === 'Tab'
    ) {
      event.preventDefault(); // Prevent default behavior
      event.stopPropagation(); // Stop propagation
    }

    // Additionally, check if Alt and Tab are pressed together
    if (event.altKey && event.key === 'Tab') {

      event.preventDefault(); // Prevent Alt + Tab
      event.stopPropagation();
    }
  };


  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      if (!isAlertShown) {
        if (warningCount1 + warningCount2 === 2) {
          let a = Object.keys(answers).length;
          let v = Object.keys(visited).length;
          let s = Object.keys(submit).length;
          let ua = question?.length - v;

          localStorage.removeItem("student");
          navigate(`/finalsubmit/${s}/${v}/${ua}`);
          warningCount1 = 0;
        } else {
          alert('This is your final chance. If you switch windows again, your test will be automatically submitted.');
          isAlertShown = true;
          warningCount1++;
        }
      }
    } else {
      isAlertShown = false; // Reset flag when visibility changes back to visible
    }
  };

  const handleWindowBlur = () => {
    if (warningCount1 + warningCount2 === 2) {
      let a = Object.keys(answers).length;
      let v = Object.keys(visited).length;
      let s = Object.keys(submit).length;
      let ua = question?.length - v;

      localStorage.removeItem("student");
      navigate(`/finalsubmit/${s}/${v}/${ua}`);
      warningCount2 = 0;
    } else {
      isAlertShown = false; // Reset flag when window blur event occurs
      if (!isAlertShown) {
        alert('This is your final chance. If you switch windows again, your test will be automatically submitted.');
        isAlertShown = true;
        warningCount2++;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);





  useEffect(() => {
    const handleKeyDown = (event) => {
      // Define an array of key combinations to block

      const blockedKeyCombinations = [
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Escape', 'Meta', 'ContextMenu', 'PrintScreen',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Control', 'Alt',
        'Control+KeyC', 'Control+KeyV', 'Control+KeyX', 'Control+KeyA', 'Control+Shift+KeyJ', 'Control+Shift+KeyI', 'Alt+ArrowLeft', 'Alt+ArrowRight', 'Backspace',
        'MediaPlayPause', 'MediaStop', 'MediaTrackNext', 'MediaTrackPrevious', 'VolumeUp', 'VolumeDown', 'VolumeMute'
      ];

      const keyCombination =
        (event.ctrlKey ? 'Control+' : '') +
        (event.shiftKey ? 'Shift+' : '') +
        (event.altKey ? 'Alt+' : '') +
        event.code;

      if (blockedKeyCombinations.includes(keyCombination)) {
        event.preventDefault();
        console.log(`${keyCombination} key combination is blocked.`);
      }
    };

    const blockContextMenu = (event) => {
      event.preventDefault();
    };

    // Add event listener for keydown when component mounts
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', blockContextMenu);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, []);















  // its working code of the face recognization

  // useEffect(() => {
  //   // Setup the socket connection to the server
  //   socket.current = io('http://192.168.0.139:5000', {
  //     // socket.current = io('http://localhost:5000', {
  //     reconnection: true,
  //     reconnectionDelay: 2000,
  //   });

  //   let mediaRecorder;
  //   let recordedChunks = [];

  //   // Function to handle data availability
  //   const handleDataAvailable = event => {
  //     if (event.data && event.data.size > 0) {
  //       console.log(`Sending data: ${event.data.size} bytes`);
  //       socket.current.emit('video_data', event.data);
  //     }
  //   };

  //   // Request access to the webcam
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then(stream => {
  //       // Initialize MediaRecorder with the stream
  //       mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

  //       // Event handler for when recorded data is available
  //       mediaRecorder.ondataavailable = handleDataAvailable;

  //       // Start recording the video stream in chunks of 2 seconds
  //       mediaRecorder.start(5000);

  //       // Stop recording and reset every 2 seconds to send continuous data
  //       const interval = setInterval(() => {
  //         if (mediaRecorder.state === "recording") {
  //           mediaRecorder.stop();
  //           mediaRecorder.start(5000);
  //         }
  //       }, 5000);

  //       // Cleanup interval on unmount
  //       return () => clearInterval(interval);
  //     })
  //     .catch(error => {
  //       console.error('Error accessing the webcam', error);
  //     });

  //   // Handling results from the server
  //   socket.current.on('result', result => {
  //     console.log('Received result from server:', result);
  //     // Here you can handle the result, such as displaying it or processing further
  //   });
  //   // Handle socket connection errors
  //   socket.current.on('connect_error', (err) => {
  //     console.error('Socket connection error:', err);
  //   });

  //   socket.current.on('reconnect_error', (err) => {
  //     console.error('Socket reconnection error:', err);
  //   });

  //   socket.current.on('disconnect', (reason) => {
  //     console.warn('Socket disconnected:', reason);
  //   });

  //   // Cleanup function
  //   return () => {
  //     if (mediaRecorder && mediaRecorder.state !== "inactive") {
  //       mediaRecorder.stop();
  //     }
  //     if (socket.current) {
  //       socket.current.disconnect();
  //     }
  //   };
  // }, []);



  // yha tak hai 

  let first = true;

  // useEffect(() => {
  //   // Setup the socket connection to the server
  //   socket.current = io('http://192.168.0.139:5000', {
  //     reconnection: true,
  //     reconnectionDelay: 2000,
  //   });

  //   let mediaRecorder;
  //   let recordedChunks = [];


  //   // Function to handle data availability
  //   const handleDataAvailable = event => {
  //     if (event.data && event.data.size > 0) {
  //       console.log(`Sending data: ${event.data.size} bytes`);
  //       socket.current.emit('video_data', event.data);
  //     }
  //   };

  //   const setupMediaRecorder = () => {
  //     // Request access to the webcam
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //       .then(stream => {
  //         console.log("stream")
  //         // Initialize MediaRecorder with the stream
  //         mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

  //         // Event handler for when recorded data is available
  //         mediaRecorder.ondataavailable = handleDataAvailable;

  //         // Start recording the video stream in chunks of 5 seconds
  //         mediaRecorder.start(2000);

  //         // Stop recording and reset every 5 seconds to send continuous data
  //         const interval = setInterval(() => {
  //           if (mediaRecorder.state === "recording") {
  //             mediaRecorder.stop();
  //             mediaRecorder.start(2000);
  //           }
  //         }, 2000);

  //         // Cleanup interval on unmount
  //         return () => clearInterval(interval);
  //       })
  //       .catch(error => {
  //         console.log("kdjfkdjfkd----->", error.name)
  //         console.error('Error accessing the webcam', error.name);
  //         // If permission denied, show alert message and blur/disable the page
  //         if (error instanceof DOMException || error.name === 'NotAllowedError') {
  //           alert('Please allow access to the camera for the test.');
  //           document.body.style.filter = 'blur(5px)';
  //           document.body.style.pointerEvents = 'none';
  //         }
  //       });

  //     if (first) {
  //       first = false;
  //     }
  //     // Listen for changes in camera state
  //     // if (!mediaRecorder && !first) {
  //     //   // Listen for changes in camera state
  //     //   alert('Access to camera denied. Please refresh the page and grant access to continue.');
  //     //   document.body.style.filter = 'blur(5px)';
  //     //   document.body.style.pointerEvents = 'none';
  //     //   // mediaRecorder.onstop = () => {

  //     //   // };
  //     // }

  //   };

  //   setupMediaRecorder();

  //   // Handling results from the server
  //   socket.current.on('result', result => {
  //     console.log('Received result from server:', result);
  //     // Here you can handle the result, such as displaying it or processing further
  //   });
  //   // Handle socket connection errors
  //   socket.current.on('connect_error', (err) => {
  //     console.error('Socket connection error:', err);
  //   });

  //   socket.current.on('reconnect_error', (err) => {
  //     console.error('Socket reconnection error:', err);
  //   });

  //   socket.current.on('disconnect', (reason) => {
  //     console.warn('Socket disconnected:', reason);
  //   });

  //   // Cleanup function
  //   return () => {
  //     if (mediaRecorder && mediaRecorder.state !== "inactive") {
  //       mediaRecorder.stop();
  //     }
  //     if (socket.current) {
  //       socket.current.disconnect();
  //     }
  //   };
  // }, []);




  useEffect(() => {
    if (timeFinish) {
      toast.success("Time Finish")
      submigNavigate();
    }
  }, [timeFinish]);





  return (
    <>
      <div className="" ref={fullScreenRef} style={{ height: "100vh", backgroundColor: "white" }}>
        <div className={`container-fluid d-flex justify-content-between  py-3 px-4 ${classes.headbar}`} style={{ backgroundColor: "rgb(129 207 118)" }}  >
          <div className="">
            <img src={ios} alt="" height="30" className="auth-logo-dark " />
          </div>
          <div className="text-white text-center fw-bold">
            <h2>Exam Name : {question?.[0]?.examName}</h2>
          </div>
          <div className="text-white text-center fw-bold">

          </div>
        </div>
        <div className="container-fluid bg-white px-4 py-2">
          <div className="row pt-4 test_screen_main">
            <div className="col-8 mx-3 shadow animate__animated animate__fadeInLeft test_screen_left">
              <div className="row d-flex justify-content-center align-item-center pt-3 ">
                <div className="col d-flex justify-content-center align-item-center fw-bolder">
                  <FaClipboardQuestion style={{ width: "40px", height: "40px" }} />
                  <span style={{ marginTop: "10px" }}>
                    Total Questions : {question?.length}
                  </span>
                </div>
                <div className="col d-flex justify-content-center align-item-center">
                  <MdTimer style={{ width: "40px", height: "40px" }} />
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      marginTop: "5px",
                      fontWeight: "bolder",
                    }}
                  >
                    {question?.length > 0 &&
                      <Timer time={question[0]?.time} setTimeFinish={setTimeFinish}></Timer>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onFinalSubmitHandler}
                  className="col-2 fs btn btn-outline-success d-flex justify-content-center align-items-center me-4 fw-bold"

                >
                  Finish Test
                  <IoCheckmarkDoneCircleSharp
                    style={{ width: "20px", height: "20px", margin: "5px" }}
                  ></IoCheckmarkDoneCircleSharp>
                </button>
              </div>


              <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Body>

                  <h4>
                    Are you sure want to submit the paper.
                  </h4>


                </Modal.Body>
                <Modal.Footer>
                  <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">No</Button>{" "}
                  <Button type="button" color="danger" onClick={submigNavigate} className="waves-effect waves-light">Yes</Button>{" "}

                </Modal.Footer>
              </Modal>
              <hr></hr>
              <div className="container">
                <br />
                <div className="ms-5">
                  <h4>
                    <span className="" key={question?.[currentQuestionIndex]?.description}>
                      Q {currentQuestionIndex + 1} :
                    </span>
                    <span className="">
                      &nbsp; {question?.[currentQuestionIndex]?.description}
                    </span>
                    <div>
                      {question?.[currentQuestionIndex]?.imagePaths.map((path) => (
                        <img src={IMAGE_FETCH + path} alt="" />
                      ))}

                    </div>
                  </h4>
                  <br />
                  <div className="row p-2">
                    {question?.[currentQuestionIndex]?.type === "mcq"
                      ? question?.[currentQuestionIndex]?.optionNames.map((o, i) => (
                        <>
                          {/* <p>{o}</p> */}
                          <div className="form-check mb-3">
                            <input
                              className="form-check-input mt-1"
                              type="radio"
                              name="options"
                              id={i}
                              value={o}
                              checked={answer === o}
                              onChange={(e) => handleAnswerChange(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={i}
                            >
                              {o}
                            </label>

                          </div>
                        </>

                      ))
                      :
                      <>
                        <div className="col-md-10">
                          <textarea id="multiline-input"
                            name="message"
                            rows="10" cols="50"
                            className='form-control'
                            placeholder="Write Your Answer Here"
                            value={answer}
                            onChange={(e) => handleAnswerChange(e.target.value)} >

                          </textarea>
                        </div>
                      </>

                    }

                  </div>
                </div>
              </div>
              <div className="container">
                <div className="d-flex justify-content-end my-4">

                  {!nextVisible && (
                    <button
                      type="button"
                      className="btn  border-danger mx-2 fw-bold text-danger"
                      style={{ display: currentQuestionIndex === question?.length - 1 ? "block" : "none" }}

                    >
                      Submit
                    </button>
                  )}
                  {nextVisible && (
                    <button
                      type="button"
                      className="btn btn-warning mx-2 fw-bold "
                      style={{ display: currentQuestionIndex === question?.length - 1 ? "block" : "none" }}
                      onClick={() => {
                        submitLastQuestion(question?.[currentQuestionIndex]);
                      }}
                    >
                      Submit
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn  btn-outline-warning mx-2 text-warning skip_btn"
                    style={{ display: currentQuestionIndex === question?.length - 1 ? "none" : "block" }}

                    onClick={handleSkipQuestion}

                  >
                    Skip
                  </button>
                  {!nextVisible && (
                    <button
                      type="button"
                      className="btn  border-danger mx-2 fw-bold text-danger"
                      style={{ display: currentQuestionIndex === question?.length - 1 ? "none" : "block" }}
                    >
                      next{" "}
                      <BsXCircleFill style={{ width: "15px", height: "15px" }} />
                    </button>
                  )}
                  {nextVisible && (
                    <button
                      type="button"
                      className="btn btn-warning mx-2 fw-bold "
                      style={{ display: currentQuestionIndex === question?.length - 1 ? "none" : "block" }}
                      onClick={() => {
                        submitQuestion(question?.[currentQuestionIndex]);
                      }}
                    >
                      next{" "}
                      <PiFastForwardCircleBold
                        style={{ width: "30px", height: "30px", color: "white" }}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <QuestionSelector visited={visited} submit={submit} question={question} jumpQuestion={jumpQuestion} />
          </div>
        </div>
      </div>
    </>

  );
};
export default TestScreen;
