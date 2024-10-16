import React, { useEffect, useState } from "react"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle, Button, } from "reactstrap"

import { connect } from "react-redux";
import Select from "react-select"

//Import Action to copy breadcrumb items from local state to redux state
import { deleteQuestion, fetchClass, fetchCourse, fetchDifficulty, fetchLanguage, fetchQuestion, fetchSection, fetchSubSection, setBreadcrumbItems, setSuccessFalseQuestion, updateQuestion } from "../../store/actions";

import "../Tables/datatables.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { fetchSingleQuestion } from "helpers/question_helper";
import { BACKEND_SPRING, IMAGE_FETCH } from "helpers/url_helper";
import DOMPurify from 'dompurify';
import { useWindowSize } from 'react-use';
import Loader from "components/Loader/Loader";
const QcReturnQuestion = (props) => {
    document.title = "Question Bank | All Questions";
    const [modalShow, setModalShow] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [id, setId] = useState({});
    const [classs, setClasss] = useState(null);
    const [type, setType] = useState('short');
    const [difficulty, setDifficulty] = useState(null);
    const [language, setLanguage] = useState(null);
    const [answer, setAnswer] = useState("");
    const [course, setCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [section, setSection] = useState(null);
    const [sections, setSections] = useState([]);
    const [subSection, setSubSection] = useState(null);
    const [subSections, setSubSections] = useState([]);
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [editOptionText, setEditOptionText] = useState("Edit Options");
    const [optionsEditDisplay, setOptionsEditDisplay] = useState("none");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [loader, setLoader] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const dispatch = useDispatch();
    const questions = useSelector(state => state.questionsReducer);
    const classes = useSelector(state => state.classesReducer);
    // const courses = useSelector(state => state.coursesReducer);
    // const sections = useSelector(state => state.sectionsReducer);
    // const subSections = useSelector(state => state.subSectionsReducer);
    const difficultys = useSelector(state => state.difficultysReducer)
    const languages = useSelector(state => state.languagesReducer);
    const { width } = useWindowSize();
    const [loader2, setLoader2] = useState(true);
    let pack = JSON.parse(localStorage.getItem("authUser"))?.packageName;
    const breadcrumbItems = [
        { title: "Question", link: "#" },
        { title: "Qc Return Questions", link: "#" },
    ]

    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])



    useEffect(() => {
        props.setBreadcrumbItems('Qc Return Questions', breadcrumbItems)
    })




    useEffect(() => {
        setLoader2(true);
        dispatch(fetchClass());
        dispatch(fetchQuestion());
        dispatch(fetchDifficulty());
        dispatch(fetchLanguage());

    }, []);

    useEffect(() => {
        if (questions?.questions?.success == true) {
            setLoader2(false);
        }
    }, [questions?.questions]);

    const fetchCourses = async () => {
        if (classs) {
            let id = classs.id;

            let result = await fetchAllCoursesByClass(id);
            setCourses(result);
            // courses = result;
        }
    }
    useEffect(() => {
        fetchCourses();
    }, [classs]);

    const fetchSections = async () => {
        if (course) {
            let id = course.id;

            let result = await fetchAllSectionsByCourse([id]);
            setSections(result);
            // sections = result;
        }
    }
    useEffect(() => {
        fetchSections();
    }, [course]);

    const fetchSubSections = async () => {
        if (section) {
            let id = section.id;

            let result = await fetchAllSubSectionsBySection([id]);
            setSubSections(result);
            // subSection = result;
        }
    }
    useEffect(() => {
        fetchSubSections();
    }, [section]);


    const fetchImageFile = async () => {

        const tempDiv = rteObj.getContent();
        const objectElements = tempDiv.querySelectorAll('.e-rte-image');

        if (objectElements.length > 0) {
            try {
                const filesPromises = Array.from(objectElements).map(async (objectElement) => {
                    const imageUrl = objectElement.getAttribute('src');
                    const name = objectElement.getAttribute('alt') || 'unnamed';

                    const response = await fetch(imageUrl);
                    const blob = await response.blob();

                    return new File([blob], `image_${name}.png`, { type: 'image/png' });
                });

                return await Promise.all(filesPromises);
            } catch (error) {
                console.error('Error fetching images:', error);
                return [];
            }
        } else {
            console.log('No img element found within .e-rte-image');
            return [];
        }
    };

    const sanitizeAndRenderHTML = (htmlString) => {
        const sanitizedHTML = DOMPurify.sanitize(htmlString);
        return { __html: sanitizedHTML };
    };
    const extractTextContent = (htmlString) => {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    };


    const data = {
        columns: [
            {
                label: "Serial No.",
                field: "serialNo",
                sort: "asc",
                width: 50,
            },
            {
                label: "Type",
                field: "type",
                sort: "asc",
                width: 100,
            },
            {
                label: "Question",
                field: "contentText",
                sort: "asc",
                width: 150,
            },
            {
                label: "Answer",
                field: "answer",
                sort: "asc",
                width: 200,
            },
        ],
        rows: questions?.questions?.result?.map((row, index) => ({
            ...row,
            serialNo: index + 1, // Add 1 to start counting from 1
            clickEvent: () => handleRowClick(row)
        }))
    };

    // Modify the data for the "Question" field if bulkCreated is 0
    data?.rows?.forEach(row => {
        if (row.bulkCreated === 0) {
            row.description = row.contentText; // Assign contentText to description if bulkCreated is 0
        }
    });


    const [test, setTest] = useState([]);
    const handleRowClick = async (row) => {

        setId(row.id);
        let result = await fetchSingleQuestion(row?.id);
        setDescription(result?.result[0]?.description);
        setAnswer(result?.result[0]?.answer)
        setType(result?.result[0]?.type);


        setCourse(result?.result[0]?.course);
        setSection(result?.result[0]?.section);
        setSubSection(result?.result[0]?.subSection);
        setDifficulty(result?.result[0]?.difficulty);
        setLanguage(result?.result[0]?.language);

        let imagesHTML;
        if (BACKEND_SPRING) {
            setClasss(result?.result[0]?.classs);
            if (result?.result[0].type == "mcq") {
                let arr = [];
                result?.result[0]?.optionResult?.map((d) => {

                    arr.push(d.optionName);
                })
                console.log(arr)
                setTest(arr);
                setOptions(arr);

            }
            imagesHTML = result?.result[0].imageResult?.map(url =>
                `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
                // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
            ).join('');
        }
        else {
            setClasss(result?.result[0]?.class);


            if (result?.result[0]?.type == "mcq") {
                let arr = [];
                result?.optionResult?.map((d) => {
                    arr.push(d.optionName);
                })
                setOptions(arr);
            }
            imagesHTML = result?.imageResult?.map(url =>
                `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
                // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
            ).join('');
        }
        setOldImages(imagesHTML);
        setModalShow(true);
    }



    function removeSpecificDivs(htmlString) {
        // Parse the HTML string into a new DOM document
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Selectors for the divs to remove based on class and id
        const selectorsToRemove = [
            'div.e-rte-content#defaultRTErte-view',
            'div.e-content.e-lib.e-keyboard#defaultRTE_rte-edit-view'
        ];

        // Iterate over selectors and remove the matching elements
        selectorsToRemove.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(element => {
                // Instead of removing the element, we replace it with its content
                while (element.firstChild) {
                    element.parentNode.insertBefore(element.firstChild, element);
                }
                element.parentNode.removeChild(element);
            });
        });

        // Serialize the updated DOM back to a string
        // Inner HTML of the body will contain the expected output
        return doc.body.innerHTML;
    }


    const removeImgTag = (htmlContent) => {
        // Create a temporary element to parse the HTML string
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;

        // Find all image elements
        const imageElements = tempElement.querySelectorAll('img');

        // Remove each image element
        imageElements.forEach(imageElement => {
            imageElement.parentNode.removeChild(imageElement);
        });

        // Return the modified HTML
        return tempElement.innerHTML;
    };


    const handleUpdate = async () => {
        // const rteValue = rteObj.getText();
        // Get the HTML content from rteObj.getContent()
        const res = rteObj.getContent();
        let desc = res.outerHTML;

        // Remove the specified div and update the HTML content
        desc = removeSpecificDivs(desc);

        let tempElement = document.createElement('div');
        tempElement.innerHTML = res.outerHTML;
        let textContent = tempElement.textContent || tempElement.innerText;
        if (!classs || !course || !section || !subSection || !desc || !difficulty || !language || !type || !answer) {
            setSpanDisplay("inline")

        }
        else {

            const fetchedImageFiles = await fetchImageFile();
            const formData = new FormData();
            fetchedImageFiles.forEach((image) => {
                formData.append('Image', image);
            });
            options?.forEach((option) => {
                formData.append("Options", option);
            });
            formData.append('Id', id);
            formData.append('ClassId', classs.id);
            formData.append('Class', JSON.stringify(classs))
            formData.append('CourseId', course.id);
            formData.append('Course', JSON.stringify(course));
            formData.append('SectionId', section.id);
            formData.append('Section', JSON.stringify(section));
            formData.append('SubSectionId', subSection.id);
            formData.append('SubSection', JSON.stringify(subSection));
            formData.append('Description', removeImgTag(desc));
            formData.append('ContentText', textContent);
            formData.append('DifficultyId', difficulty.id);
            formData.append('languageId', language.id);
            formData.append('Difficulty', JSON.stringify(difficulty));
            formData.append('Type', type);
            formData.append('Answer', answer);

            setLoader(true);
            dispatch(updateQuestion(formData));
            dispatch(fetchQuestion());
            console.log(questions)
        }
    }
    useEffect(() => {
        if (questions.success == true) {
            setModalShow(false);
            setDeleteModalShow(false);
            dispatch(setSuccessFalseQuestion());
        }
        setLoader(false);
    }, [questions.success]);

    const handleDelete = () => {

        setLoader(true);
        dispatch(deleteQuestion(id));
    }

    const handleSelectClass = selectedOption => {
        setClasss(selectedOption);
        setCourses([]);
        setSections([]);
        setCourse(null);
        setSection(null);
    };

    const handleSelectCourse = selectedOption => {
        setCourse(selectedOption);
        setSections([]);
        // sections = [];
        setSubSections([]);
        // subSections = [];
        setSection(null);
        setSubSection(null);
    };

    const handleSelectSection = selectedOption => {
        setSection(selectedOption);
        setSubSections([]);
        setSubSection(null);
    };
    const handleSelectSubSection = selectedOption => {
        setSubSection(selectedOption);
    };
    const handleSelectDifficulty = selectedOption => {
        setDifficulty(selectedOption);
    };
    const handleSelectLanguage = selectedOption => {
        setLanguage(selectedOption);
    };
    const handleTypeChange = (event) => {
        setType(event.target.value);
        setAnswer("");
    };
    const addOption = () => {
        console.log(options)
        setOptions([...options, option]);
        setOption("");
    }
    const handleSetOptionsClick = () => {
        if (optionsEditDisplay == "none") {
            setOptionsEditDisplay("inline-block");
            setEditOptionText("Done");
        }
        else {
            setOptionsEditDisplay("none");
            setEditOptionText("Edit Options");
        }
    }
    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };




    // ***** code for rich text editor textarea ****************


    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', '|',
            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
            'SourceCode', '|', 'Undo', 'Redo']
    };
    const quickToolbarSettings = {
        image: ['Replace', 'Align', 'Caption', 'Remove', 'InsertLink', 'OpenImageLink', '-', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'],
        link: ['Open', 'Edit', 'UnLink']
    };

    let rteObj;
    // set the value to Rich Text Editor
    // let template = `<div style="display:block;"><p style="margin-right:10px">${description} ${oldImages}</p></div>`;
    let template = description + oldImages;
    // let template = description;


    // Rich Text Editor items list
    let items = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
        'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', '|', 'Undo', 'Redo'
    ];
    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}
            {loader2 ? (
                <Loader />
            ) : ("")}
            <Row>
                <Col className="col-12">
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <CardTitle className="h4">All Questions </CardTitle>

                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>




        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(QcReturnQuestion);


