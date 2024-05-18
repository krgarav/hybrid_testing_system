let url = "http://192.168.0.54:82/api/";
export let url_online = "https://2zrl7bwf-5290.inc1.devtunnels.ms";
export const BACKEND_SPRING = false;
// let url_online = "http://192.168.0.184:8080";
// export const BACKEND_SPRING = true;



//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
// export const POST_LOGIN = "http://localhost:8000/api/v1/auth/login"
export const POST_LOGIN = url_online + "/Login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"
export const STUDENT_REGISTER = url_online + "/RegisterStudent";

// class
// using node
// export const CREATE_CLASS = "http://localhost:8000/api/v1/class/create-class"
// export const DELETE_CLASS = "http://localhost:8000/api/v1/class/delete-class/"
// export const UPDATE_CLASS = "http://localhost:8000/api/v1/class/update-class/"
// export const FETCH_ALL_CLASSES = "http://localhost:8000/api/v1/class/get-class"

// using .Net
export const CREATE_CLASS = url_online + "/CreateClass"
export const DELETE_CLASS = url_online + "/RemoveClass?Id="
export const UPDATE_CLASS = url_online + "/UpdateClass"
export const FETCH_ALL_CLASSES = url_online + "/GetClass"
// export const FETCH_ALL_CLASSES = "http://localhost:8080/api/MasterApi/GetAllClasses"

// course
// using node 
// export const CREATE_COURSE = "http://localhost:8000/api/v1/course/create-course"
// export const DELETE_COURSE = "http://localhost:8000/api/v1/course/delete-course/"
// export const UPDATE_COURSE = "http://localhost:8000/api/v1/course/update-course/"
// export const FETCH_ALL_COURSES = "http://localhost:8000/api/v1/course/get-course"
// export const FETCH_ALL_COURSE_CLASS_BASED = "http://localhost:8000/api/v1/course/get-course-based-on-class"

// using .net
export const CREATE_COURSE = url_online + "/CreateCourse"
export const DELETE_COURSE = url_online + "/RemoveCourse?Id="
export const UPDATE_COURSE = url_online + "/UpdateCourse"
export const FETCH_ALL_COURSES = url_online + "/GetCourse"
export const FETCH_ALL_COURSE_BY_CLASS = url_online + "/GetCourseByClass?id="

// section
// using node 
// export const CREATE_SECTION = "http://localhost:8000/api/v1/section/create-section"
// export const DELETE_SECTION = "http://localhost:8000/api/v1/section/delete-section/"
// export const UPDATE_SECTION = "http://localhost:8000/api/v1/section/update-section/"
// export const FETCH_ALL_SECTIONS = "http://localhost:8000/api/v1/section/get-section"
// export const FETCH_ALL_SECTION_COURSE_BASED = "http://localhost:8000/api/v1/section/get-section-based-on-course"


// using .net 
export const CREATE_SECTION = url_online + "/CreateSection"
export const DELETE_SECTION = url_online + "/RemoveSection?Id="
export const UPDATE_SECTION = url_online + "/UpdateSection"
export const FETCH_ALL_SECTIONS = url_online + "/GetSection"
export const FETCH_ALL_SECTION_BY_COURSE = url_online + "/GetSectionByCourse"
// export const FETCH_ALL_SECTION_BY_COURSE = "https://1gl7npqf-5290.inc1.devtunnels.ms/api/MasterAPI/GetSectionByCourse"

// sub section
// using node 
// export const CREATE_SUBSECTION = "http://localhost:8000/api/v1/subSection/create-subSection"
// export const DELETE_SUBSECTION = "http://localhost:8000/api/v1/subSection/delete-subSection/"
// export const UPDATE_SUBSECTION = "http://localhost:8000/api/v1/subSection/update-subSection/"
// export const FETCH_ALL_SUBSECTIONS = "http://localhost:8000/api/v1/subSection/get-subSection"

// using .net 
export const CREATE_SUBSECTION = url_online + "/CreateSubSection"
export const DELETE_SUBSECTION = url_online + "/RemoveSubSection?Id="
export const UPDATE_SUBSECTION = url_online + "/UpdateSubSection"
export const FETCH_ALL_SUBSECTIONS = url_online + "/GetSubSection"
export const FETCH_ALL_SUBSECTION_BY_SECTION = url_online + "/GetSubSectionBySection"

// difficulty
// using .net
export const CREATE_DIFFICULTY = url_online + "/CreateDifficulty"
export const DELETE_DIFFICULTY = url_online + "/RemoveDifficulty?Id="
export const UPDATE_DIFFICULTY = url_online + "/UpdateDifficulty"
export const FETCH_ALL_DIFFICULTYS = url_online + "/GetDifficulty"


export const CREATE_LANGUAGE = url_online + "/AddzLanguage"
export const DELETE_LANGUAGE = url_online + "/RemoveLanguage?Id="
export const UPDATE_LANGUAGE = url_online + "/UpdateLanguage"
export const FETCH_ALL_LANGUAGES = url_online + "/GetLanguages"
// question
// using node 
// export const CREATE_QUESTION = "http://localhost:8000/api/v1/question/create-question"
// export const DELETE_QUESTION = "http://localhost:8000/api/v1/question/delete-question/"
// export const UPDATE_QUESTION = "http://localhost:8000/api/v1/question/update-question/"
// export const FETCH_ALL_QUESTIONS = "http://localhost:8000/api/v1/question/get-question"

// using .net
// export const CREATE_QUESTION = url_online + "QuestionBankAPI/CreateQuestion"
export const CREATE_QUESTION = url_online + "/CreateQuestion"
export const BULK_CREATE_QUESTION = url_online + "/BulkQuestionCreate"
export const DELETE_QUESTION = url_online + "/RemoveQuestion?Id="
export const UPDATE_QUESTION = url_online + "/UpdateQuestion"
export const FETCH_ALL_QUESTIONS = url_online + "/GetQuestions"
export const FETCH_SINGLE_QUESTION = url_online + "/GetSingleQuestions?Id=";

// image 
// using .net 
export const IMAGE_FETCH = url_online + "/GetImage?imageName=";



// Question Paper
export const CREATE_QUESTIONPAPER = url_online + "/CreateQuestionPaper";
export const UPDATE_QUESTIONPAPER = url_online + "/UpdateQuestionPaper";
export const DELETE_QUESTIONPAPER = url_online + "/DeleteExamPaper?Id=";
export const FETCH_ALL_QUESTIONPAPERS = url_online + "/GetExamPapers";
export const FETCH_EXAM_PAPER = url_online + "/GetExamPapersById?Id=";
export const DELETE_QUESTION_FROM_PAPER = url_online + "/DeleteExamQuestion?PaperId=";
export const FETCH_FILTER_QUESTIONS = url_online + "/GetFilterQuestions";
export const ADD_QUESTION_TO_PAPER = url_online + "/AddQuestionToPaper";




// USER 
// using .net
export const CREATE_USER = url_online + "/UserRegister"
export const DELETE_USER = url_online + "/RemoveDifficulty?Id="
export const UPDATE_USER = url_online + "/UpdateUser"
export const FETCH_ALL_USERS = url_online + "/GetUsers"
export const GET_USER_TYPE = url_online + "/GetUserType"
export const GET_OTP = url_online + "/GetOTP"
export const VERIFY_OTP = url_online + "/VerifyOTP"


// SCHOOL 
// using .Net
export const CREATE_SCHOOL = url_online + "/CreateSchool"
export const DELETE_SCHOOL = url_online + "/RemoveClass?Id="
export const UPDATE_SCHOOL = url_online + "/UpdateSchool"
export const FETCH_ALL_SCHOOL = url_online + "/GetAllSchools"
export const FETCHS_SCHOOL_TYPES = url_online + "/GetSchoolTypes"

export const UPLOAD_STUDENTS = url_online + "/BulkStudentUpload";
export const LOGIN_STUDENT = url_online + "/StudentLogin";


//Exam
export const SAVE_EXAM_ANSWERS = url_online + "/saveExamAnswers"

// exam managment
export const FETCH_ALL_CENTERS = url_online + "/GetAllCenters";
export const CENTER_ALLOCATION = url_online + "/GetCenterAllocated";
export const TOTAL_SUTDENTS_CENTER_CAPACITY_COUNT = url_online + "/GetCountOfCenterStudents?PaperId=";
export const ALLOCATE_ROLL_NUMBER_AND_PASSWORD = url_online + "/AllocateRollNoAndPassword?PaperId=";
export const CREATE_MAIN_EXAM_PAPER = url_online + "/CreateMainExamPaper";
export const GET_ALL_MAIN_EXAM_PAPERS = url_online + "/GetMainExamPapers";
export const DELETE_MAIN_EXAM_PAPER = url_online + "/DeleteMainExamPaper?Id=";


//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS
export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/product"

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"

//CHATS
export const GET_CHATS = "/chats";
export const GET_GROUPS = "/groups";
export const GET_CONTACTS = "/contacts";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "/add/messages";
export const DELETE_MESSAGE = "/delete/message";

//TASKS
export const GET_TASKS = "/tasks";
export const DELETE_KANBAN = "/delete/tasks"
export const ADD_CARD_DATA = "/add/tasks"
export const UPDATE_CARD_DATA = "/update/tasks"
