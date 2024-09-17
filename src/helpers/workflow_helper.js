import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"
import { toast } from "react-toastify";

// Create course
export const createWorkflowTree = data => post(url.CREATE_WORKFLOW_TREE, data);
export const updateWorkflowTree = data => put(url.UPDATE_WORKFLOW_TREE, data);
export const deleteWorkflowTree = id => del(url.DELETE_WORKFLOW_TREE + id);
export const fetchAllWorkflowTree = () => get(url.GET_ALL_WORKFLOW_TREE);
export const fetchSingleWorkflowTree = () => get(url.GET_SINGLE_WORKFLOW_TREE);

