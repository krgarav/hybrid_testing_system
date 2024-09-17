import React, { useEffect, useState } from "react"

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
    Form,
    Button
} from "reactstrap"

import { connect } from "react-redux";

//Import Action to copy breadcrumb items from local state to redux state
import { fetchUser, setBreadcrumbItems } from "../../store/actions";
import Loader from "components/Loader/Loader";
import Tree from 'react-d3-tree';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createWorkflowTree, fetchAllWorkflowTree, updateWorkflowTree } from "helpers/workflow_helper";
import { toast } from "react-toastify";
import Select from "react-select"
import { Modal } from "react-bootstrap";
const Workflow = (props) => {
    document.title = "Question Bank | Workflow";




    const breadcrumbItems = [
        { title: "Workflow", link: "#" },
        { title: "QB Wrokflow", link: "#" },
    ]
    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])
    useEffect(() => {
        props.setBreadcrumbItems('QB Workflow', breadcrumbItems)
    })
    const dispatch = useDispatch();
    const users = useSelector(state => state?.userReducer?.users);
    let [allUsers, setAllUsers] = useState([]);
    // const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {

        if (users?.length == 0) {
            dispatch(fetchUser());
        }
        else {
            // allUsers = users?.result;
            // console.log(allUsers?.result)
        }

    }, [])

    useEffect(() => {
        // allUsers = users?.result;
        setAllUsers(users?.result);
        console.log("flag ", allUsers)
    }, [users])

    const [loader, setLoader] = useState(false);
    const [treeData, setTreeData] = useState(null); // Start with empty tree data
    const [selectedUser, setSelectedUser] = useState(''); // For dropdown selection
    const [targetNodeName, setTargetNodeName] = useState('');
    const [nodes, setNodes] = useState([]);
    const [isFirstNode, setIsFirstNode] = useState(true); // Track if it's the first node being added
    const [draggedNode, setDraggedNode] = useState(null); // State for dragged node
    const [editingNode, setEditingNode] = useState(null); // Track which node is being edited
    const [editNodeModal, setEditNodeModal] = useState(false)
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [modalSelectedNewUser, setModalSelectedNewUser] = useState("");
    const [modalSelectedOldUser, setModalSelectedOldUser] = useState("");


    useEffect(() => {
        const extractNodes = (node, nodesList = []) => {
            nodesList.push(node.name);
            if (node.children) {
                node.children.forEach((child) => extractNodes(child, nodesList));
            }
            return nodesList;
        };

        if (treeData) {
            const allNodes = extractNodes(treeData);
            setNodes(allNodes);
        } else {
            setNodes([]);
        }
    }, [treeData]);

    const getAllWorkflow = async () => {
        try {
            setLoader(true);
            const data = await fetchAllWorkflowTree();
            if (data?.success) {
                if (data?.result?.length > 0) {

                    setTreeData(data?.result[0]);
                    setIsFirstNode(false);
                }
                console.log(data?.result)
            }
            else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }
    useEffect(() => {
        getAllWorkflow();
    }, [])


    const removeNode = (node, nodeName) => {
        if (!node.children) return false;
        node.children = node.children.filter((child) => {
            if (child.name === nodeName) return false;
            return !removeNode(child, nodeName);
        });
        return node.children.length === 0;
    };

    const handleDrop = (targetNodeData) => {
        if (draggedNode) {
            const newTreeData = { ...treeData };
            const targetNode = findNode(newTreeData, targetNodeData.name);

            if (targetNode && draggedNode.name !== targetNode.name) {
                if (!targetNode.children) targetNode.children = [];
                targetNode.children.push({ ...draggedNode });

                removeNode(newTreeData, draggedNode.name);
                setTreeData(newTreeData);
                setDraggedNode(null);
            }
        }
    };



    const handleCreate = async () => {
        try {
            setLoader(true);
            const data = await createWorkflowTree(treeData);

            if (data?.success) {
                toast.success(data?.message);
                setTreeData(null);
            }
            else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }


    // const handleSelectUser = selectedOption => {
    //     setSelectedUser(selectedOption);
    // };


    const findNode = (node, nodeName) => {
        if (node.name === nodeName) return node;
        if (node.children) {
            for (let child of node.children) {
                const foundNode = findNode(child, nodeName);
                if (foundNode) return foundNode;
            }
        }
        return null;
    };

    const handleAddNode = () => {
        if (!selectedUser) return;

        const newNode = { name: selectedUser.name, id: selectedUser.id };

        if (isFirstNode) {
            setTreeData(newNode);
        } else {
            if (!targetNodeName) return;
            const newTreeData = { ...treeData };
            const targetNode = findNode(newTreeData, targetNodeName);
            if (targetNode) {
                if (!targetNode.children) targetNode.children = [];
                targetNode.children.push(newNode);
                setTreeData(newTreeData);
            }
        }

        setSelectedUser(null);
        setTargetNodeName(null);
    };

    const handleSelectUser = (selectedOption, nodeDatum) => {
        const newTreeData = { ...treeData };
        const nodeToEdit = findNode(newTreeData, nodeDatum.name);
        if (nodeToEdit) {
            nodeToEdit.name = selectedOption.name; // Update the name with the selected user
        }

        setTreeData(newTreeData); // Update the tree data
        setEditingNode(null); // Exit edit mode
    };

    const renderCustomNode = (rd3tNodeProps) => {
        const { nodeDatum } = rd3tNodeProps;
        const radius = 50; // Circle radius
        const fontSize = 20; // Adjusted font size

        return (
            <g>
                {/* Render a circle for each node */}
                <circle r={radius} fill="lightblue" />

                {/* If the node is in edit mode, render the dropdown */}
                {editingNode === nodeDatum.name ? (
                    <foreignObject x="-70" y="-30" width="140" height="60">
                        <div xmlns="http://www.w3.org/1999/xhtml">
                            <Select
                                value={allUsers.find(user => user.name === nodeDatum.name)} // Current user in select
                                onChange={(selectedOption) => handleSelectUser(selectedOption, nodeDatum)} // Update user
                                options={allUsers}
                                getOptionLabel={option => option.name}
                                getOptionValue={option => option.id.toString()}
                                classNamePrefix="select2-selection"
                                menuPortalTarget={document.body} // Render menu outside of the SVG for better interaction
                            />
                        </div>
                    </foreignObject>
                ) : (
                    <>
                        {/* Render the node name when not in edit mode */}
                        <text
                            fill="black"
                            x="0"
                            y="0"
                            textAnchor="middle"
                            fontSize={fontSize}
                            fontFamily="Arial, sans-serif"
                        >
                            {nodeDatum.name}
                        </text>

                        {/* Edit and Delete buttons for switching to edit mode */}
                        <foreignObject x="-50" y="40" width="100" height="30">
                            <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                                <button
                                    onClick={() => handleEditNode(nodeDatum.name)}
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 5px',
                                        border: 'none',
                                        background: 'lightgray',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteNode(nodeDatum.name)}
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 5px',
                                        border: 'none',
                                        background: 'lightgray',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </foreignObject>
                    </>
                )}
            </g>
        );
    };



    const handleEditNode = (name) => {
        const user = allUsers.find((d) => d.name == name);
        setModalSelectedNewUser(user)
        setModalSelectedOldUser(user)
        setEditNodeModal(true);
    }

    function findNodeByName(node, newUser, oldUser) {

        // Check if the current node's name matches the target name
        if (node.name === oldUser.name) {
            node.name = newUser.name;
            node.id = newUser.id;
            return node;
        }
        // If the node has children, search through them
        if (node.children && node.children.length > 0) {
            for (let index = 0; index < node.children.length; index++) {
                let child = node.children[index];
                const result = findNodeByName(child, newUser, oldUser);
                node.children[index] = result;  // Update the child with the result
                console.log("node --> ", node);
                console.log("result --> ", result);
            }

        }
        // If no match is found, return null
        return node;
    }

    const handleUpdateNode = async () => {

        try {

            setLoader(true)
            let updatedTree = findNodeByName(treeData, modalSelectedNewUser, modalSelectedOldUser);
            console.log("updatedTree ", updatedTree);
            const data = await updateWorkflowTree(updatedTree);
            if (data?.success) {
                toast.success(data?.message);
                getAllWorkflow();
                setEditNodeModal(false)
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoader(false);
        }
    }

    const handleDeleteNode = async (name) => {

        const deleteNodeRecursively = (node, name) => {
            // Filter out the node with the specified name
            node.children = node.children.filter(child => {
                if (child.name === name) {
                    return false; // Exclude this node
                }
                deleteNodeRecursively(child, name); // Continue processing children
                return true; // Include this node
            });
        };

        if (treeData) {
            // Create a copy of the tree to avoid mutating the state directly
            const updatedTree = { ...treeData };
            deleteNodeRecursively(updatedTree, name);
            console.log(updatedTree)
            setTreeData(updatedTree); // Update state with the new tree

            try {

                setLoader(true)

                const data = await updateWorkflowTree(updatedTree);
                if (data?.success) {
                    toast.success(data?.message);
                    getAllWorkflow();
                    setEditNodeModal(false)
                } else {
                    toast.error(data?.message)
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            } finally {
                setLoader(false);
            }
        }
    };
    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}

            <Row >
                <Col>
                    <Card>
                        <CardBody className="col-lg-10 col-sm-12 col-xs-12 " >

                            <div style={{ width: '100vw', height: '100vh' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <div className="d-flex flex-row">
                                        <div className="me-2">


                                            <Select
                                                value={selectedUser}
                                                onChange={(selectedOption) => {
                                                    setSelectedUser(selectedOption);
                                                }}
                                                options={allUsers}
                                                getOptionLabel={option => option?.name}
                                                getOptionValue={option => option?.id?.toString()} // Ensure id is string
                                                classNamePrefix="select2-selection"
                                                style={{ marginRight: '10px' }}
                                            />
                                        </div>
                                        <div className="me-2">


                                            {!isFirstNode && (
                                                <Select
                                                    value={targetNodeName}
                                                    onChange={(selectedOption) => { setTargetNodeName(selectedOption); console.log(selectedOption) }}
                                                    options={nodes.map(node => ({ value: node, label: node }))}
                                                    classNamePrefix="select2-selection"
                                                    style={{ marginRight: '10px' }}
                                                />
                                            )}
                                        </div>
                                        <div className="me-2">

                                            {/* <button onClick={handleAddNode}>Add Node</button> */}
                                            <button type="submit" onClick={handleAddNode} className="btn btn-primary w-md">Add Node</button>
                                        </div>
                                        <div className="me-2">

                                            {/* <button onClick={handleAddNode}>Add Node</button> */}
                                            <button type="submit" onClick={handleCreate} className="btn btn-primary w-md">Save Tree</button>
                                        </div>
                                    </div>
                                </div>
                                {treeData && (
                                    <Tree
                                        data={treeData}
                                        translate={{ x: 200, y: 100 }}
                                        orientation="vertical"
                                        collapsible={false}
                                        renderCustomNodeElement={renderCustomNode}
                                    />
                                )}
                            </div>


                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal
                show={editNodeModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Workflow User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>



                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Select New User
                        </label>
                        <div className="col-md-10">
                            <Select
                                value={modalSelectedNewUser}
                                onChange={(selectedOption) => {
                                    setModalSelectedNewUser(selectedOption);
                                }}
                                options={allUsers}
                                getOptionLabel={option => option?.name}
                                getOptionValue={option => option?.id?.toString()} // Ensure id is string
                                classNamePrefix="select2-selection"
                                style={{ marginRight: '10px' }}
                            />
                            {!modalSelectedNewUser && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>

                    </Row>






                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setEditNodeModal(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleUpdateNode} className="waves-effect waves-light">Update</Button>{" "}
                    {/* <Button onClick={() => setModalShow(false)}>Close</Button>
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button onClick={handleDelete}>Delete</Button> */}
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(Workflow);