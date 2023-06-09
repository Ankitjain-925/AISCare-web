import axios from "axios";
import React from 'react';
import sitedata from "sitedata";
import { commonHeader } from "component/CommonHeader/index";
import { getLanguage } from "translations/index";
import _ from 'lodash';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { getProfessionalData } from "Screens/VirtualHospital/PatientFlow/data";


//For adding the New and Updating therapy
export const handleSubmit = (current) => {
    const { assignedTo, seqItems, assinged_to } = current.state;
    let translate = getLanguage(current.props.stateLanguageType);
    let { Please_enter_therapy_name, Please_enter_therapy_description, Please_enter_disease_name, Please_selete_Doctor_Staff,
        Please_select_speciality,
        Please_select_Task_Service,
        Something_went_wrong
    } = translate;
    current.setState({ errorMsg: '' })
    var data = current.state.updateTrack;
    data.house_id = current.props?.House?.value;
    data.sequence_list = seqItems;

    if (!data.therapy_name || (data && data?.therapy_name && data?.therapy_name.length < 1)) {
        current.setState({ error_section: 1, errorMsg: Please_enter_therapy_name })
    }
    else if (!data.therapy_description) {
        current.setState({ error_section: 1, errorMsg: Please_enter_therapy_description })
    }
    else if (!data.disease_name) {
        current.setState({ error_section: 1, errorMsg: Please_enter_disease_name })
    }
    else if (!data.assinged_to || ((data && data?.assinged_to && data?.assinged_to.length < 1))) {
        current.setState({ error_section: 1, errorMsg: Please_selete_Doctor_Staff })
    }
    else if (!data.speciality || ((data && data?.speciality && data?.speciality?.length < 0))) {
        current.setState({ error_section: 1, errorMsg: Please_select_speciality })
    }
    else if (!data.sequence_list || ((data && data?.sequence_list && data?.sequence_list?.length < 2))) {
        current.setState({ error_section: 2, errorMsg: Please_select_Task_Service })
    }
    else {
        current.setState({ loaderImage: true });
        if (data?._id) {
            axios
                .put(
                    sitedata.data.path + "/vt/Updatetherapy/" + current.state.updateTrack._id,
                    data,
                    commonHeader(current.props.stateLoginValueAim?.token)
                )
                .then((responce) => {
                    getAllTherpy(current);
                    current.setState({
                        updateTrack: {},
                        allSequence: {},
                        taskName: {},
                        allSequence1: [],
                        assignTask: false,
                        loaderImage: false
                    });
                    handleCloseServ(current);
                })
                .catch(() => {
                    current.setState({ loaderImage: false });
                    handleCloseServ(current);
                })
        }
        else {
            axios
                .post(
                    sitedata.data.path + "/vt/AddTherapy",
                    data,
                    commonHeader(current.props.stateLoginValueAim.token)
                )
                .then((responce) => {
                    if(responce?.data?.hassuccessed){
                        current.setState({
                            loaderImage: false,
                            allSequence: {},
                            taskName: {},
                            allSequence1: [],
                            assignTask: false,
                        });
                        getAllTherpy(current);
                        handleCloseServ(current);
                    }
                    else{

                        current.setState({
                            loaderImage: false,
                            error_section: 1, 
                            errorMsg: responce?.data?.message === "Duplicate Therapy are not allowed" ? "Therapy with same name already exists" : Something_went_wrong
                        });
                    }
                   
                })
                .catch(() => {
                    current.setState({ loaderImage: false });
                    handleCloseServ(current);
                })
        }
    }
};

// Modal Close
export const handleCloseServ = (current) => {
    current.setState({
        openServ: false,
        updateTrack: {},
        selectSpec: {},
        errorMsg: false,
        assignedTo: [],
        seqItems: []
    });
};

//Modal Open
export const handleOpenServ = (current) => {
        current.setState({
            professional_id_list1: current.state.professional_id_list,
            openServ: true,
            updateTrack: {},
            taskName: {},
            allSequence1: [],
            assignTask: false,
        });
};

//For getting the therapies
export const getAllTherpy = (current) => {
    current.setState({ loaderImage: true });
    axios
        .get(
            sitedata.data.path + "/vt/GettherapyHouse/" + current.props?.House?.value,
            commonHeader(current.props.stateLoginValueAim.token)
        )
        .then((response) => {
            if(response?.data?.hassuccessed){
                var totalPage = Math.ceil(response.data.data.length / 10);
                current.setState(
                    {
                        AllTherpy1: response.data.data,
                        loaderImage: false,
                        totalPage: totalPage,
                        currentPage: 1,
                    },
                    () => {
                        current.setState({ loaderImage: false });
                        if (totalPage > 1) {
                            var pages = [];
                            for (var i = 1; i <= current.state.totalPage; i++) {
                                pages.push(i);
                            }
                            current.setState({
                                AllTherpy: current.state.AllTherpy1.slice(0, 10),
                                pages: pages,
                            });
                        } else {
                            current.setState({ AllTherpy: current.state.AllTherpy1 });
                        }
                    }
                );
            }
            
        });
};

// For editing the therapy
export const EditTherapy = (current, data, forduplicate) => {
    if(forduplicate){
        delete data?._id;
    }
    selectProf(current, data?.assinged_to, current.state.professional_id_list1);
    var deep = _.cloneDeep(data);
    var Assigned_Aready =
        data &&
        data?.assinged_to &&
        data?.assinged_to?.length > 0 &&
        data?.assinged_to.map((item) => {
            return item?.user_id;
        });

    current.setState({
        openServ: true,
        updateTrack: deep,
        seqItems: deep?.sequence_list,
        selectSpec: {
            label: deep?.speciality?.specialty_name,
            value: deep?.speciality?._id,
        },
        Assigned_already: Assigned_Aready?.length > 0 ? Assigned_Aready : [],
    },
        () => {
            GetProfessionalData(current, true);
        });
}

// For deleting the therapy
export const DeleteTherapy = (current, data) => {
    let translate = getLanguage(current.props.stateLanguageType);
    let {
        deleteTherapy,
        yes_deletetherapy,
        are_you_sure,
        cancel_keeptherapy,
    } = translate;
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <Grid
                    className={
                        current.props.settings &&
                            current.props.settings.setting &&
                            current.props.settings.setting.mode === 'dark'
                            ? 'dark-confirm deleteStep'
                            : 'deleteStep'
                    }
                >
                    <Grid className="deleteStepLbl">
                        <Grid>
                            <a
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                <img
                                    src={require('assets/images/close-search.svg')}
                                    alt=""
                                    title=""
                                />
                            </a>
                        </Grid>
                        <label>{deleteTherapy}</label>
                    </Grid>
                    <Grid className="deleteStepInfo">
                        <label>{are_you_sure}</label>
                        <Grid>
                            <label></label>
                        </Grid>
                        <Grid>
                            <Button
                                onClick={() => {
                                    RemoveTherapy(current, data);
                                }}
                            >
                                {yes_deletetherapy}
                            </Button>
                            <Button
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                {cancel_keeptherapy}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            );
        },
    });

};

// Second Deleting Pop up
export const RemoveTherapy = (current, data) => {
    let translate = getLanguage(current.props.stateLanguageType);
    let { removeTherapy, really_want_to_remove_therapy, No, Yes } = translate;
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <div
                    className={
                        current.props.settings &&
                            current.props.settings.setting &&
                            current.props.settings.setting.mode &&
                            current.props.settings.setting.mode === 'dark'
                            ? 'dark-confirm react-confirm-alert-body'
                            : 'react-confirm-alert-body'
                    }
                >
                    <h1 class="alert-btn">{removeTherapy}</h1>
                    <p>{really_want_to_remove_therapy}</p>
                    <div className="react-confirm-alert-button-group">
                        <button onClick={onClose}>{No}</button>
                        <button
                            onClick={() => {
                                DeleteTherapyOk(current, data);
                                onClose();
                            }}
                        >
                            {Yes}
                        </button>
                    </div>
                </div>
            );
        },
    });
};

// Deleting Therapy
export const DeleteTherapyOk = (current, data) => {
    current.setState({ loaderImage: true });
    axios
        .delete(
            sitedata.data.path + "/vt/Deletetherapy/" + data?._id,
            commonHeader(current.props.stateLoginValueAim.token)
        )
        .then((responce) => {
            if (responce.data.hassuccessed) {
                getAllTherpy(current);
                current.setState({ loaderImage: false });
            }
        })
        .catch(() => {
            current.setState({ loaderImage: false });
        })
}

// Get the Professional data
export const GetProfessionalData = async (current, fromEdit) => {
    current.setState({ loaderImage: true });
    var data = await getProfessionalData(
        current.props.comesFrom === "Professional"
            ? current.state.selectedHouse?.value
            : current.props?.House?.value,
        current.props.stateLoginValueAim.token
    );
    if (data) {
        current.setState(
            {
                loaderImage: false,
                professionalArray: data.professionalArray,
                professional_id_list: data.professionalList,
                professional_id_list1: data.professionalList,
            },
            () => {
                if (fromEdit) {
                    selectProf(
                        current,
                        current.state.updateTrack?.assinged_to,
                        current.state.professional_id_list
                    );
                }
            }
        );
    } else {
        current.setState({ loaderImage: false });
    }
};

// Set State of Assined To
export const updateEntryState3 = (e, current) => {
    current.setState({ assignedTo: e }, () => {
        var data =
            e?.length > 0 &&
            e.reduce((last, e, index) => {
                let isProf =
                    current.state.professionalArray?.length > 0 &&
                    current.state.professionalArray.filter(
                        (data, index) => data.user_id === e.value || data._id === e.value
                    );
                if (isProf && isProf.length > 0) {
                    last.push(isProf[0]);
                }
                return last;
            }, []);
        const state = current.state.updateTrack;
        state["assinged_to"] = data;
        current.setState({ updateTrack: state }, () => {
            selectProf(
                current,
                current.state.updateTrack?.assinged_to,
                current.state.professional_id_list
            );
        });
    });
};

export const taskSelection = (current, e) => {
    current.setState({ taskName: e, allSequence: { "type": e?.value } });
}

export const updateEntry = (current, e) => {
    const state = current.state.allSequence;
    state[e.target.name] = e.target.value;
    current.setState({ allSequence: state });
}

export const handleAddData = (current) => {

    let translate = getLanguage(current.props.stateLanguageType);
    let { Please_enter_Task_name,
        Plz_enter_Service_Name,
        Please_enter_Task_description,
        Please_select_Service

    } = translate;
    const { indexForUpdate, allSequence, taskName, allSequence1, allSequence2 } = current.state;

    var newService = allSequence;

    current.setState({ errorMsg: "" })
    if ((taskName?.value === "task" &&
        !allSequence?.task_name) ||
        (taskName?.value === "assign_service" &&
            !allSequence?.title)) {
        current.setState({
            error_section: 3,
            errorMsg: taskName?.value === "task" ?
                Please_enter_Task_name :
                Plz_enter_Service_Name

        });
    }
    else if ((taskName?.value === "task" &&
        !allSequence?.task_description) ||
        (taskName?.value === "assign_service" &&
            ((!allSequence1) || allSequence1 && !allSequence1.length > 0))) {
        current.setState({
            error_section: 3,
            errorMsg: taskName?.value === "task" ?
                Please_enter_Task_description :
                Please_select_Service

        });
    }
    else {
        if (indexForUpdate > 0) {
            var index = indexForUpdate - 1;
            var array = current.state.seqItems;
            array[index].type = allSequence?.type;
            current.setState({
                taskName: allSequence?.type === "task" ? { value: "task", label: "Task" } :
                    { label: 'Assign Service', value: 'assign_service' }
            })
            if (allSequence && allSequence.type && allSequence.type === "task") {
                array[index].task_name = allSequence?.task_name;
                array[index].task_description = allSequence?.task_description;
            } else {
                var total = 0;
                allSequence2?.length > 0 &&
                    allSequence2.map((data, i) => {
                        if (data && data?.price) {
                            total = total + parseInt(data?.price);
                        }
                    });
                newService.services = allSequence2
                newService.amount = total
                array[index].title = newService?.title;
                array[index].amount = newService?.amount;
                array[index].services = newService?.services;
            }
            current.setState({
                seqItems: array,
                allSequence: {},
                taskName: {},
                allSequence1: [],
                assignTask: false,
                indexForUpdate: 0
            });
        }
        else {
            if (allSequence?.type === "assign_service") {
                var total = 0;
                allSequence2?.length > 0 &&
                    allSequence2.map((data, i) => {
                        if (data && data?.price) {
                            total = total + parseInt(data?.price);
                        }
                    });
                newService.services = allSequence2
                newService.amount = total

            }
            var seqItems = current.state.seqItems ?
                [...current.state.seqItems] :
                [];
            current.state.allSequence.type === "task" ?
                seqItems.push(current.state.allSequence) :
                seqItems.push(newService)
            current.setState({
                seqItems,
                allSequence: {},
                taskName: {},
                allSequence1: [],
                assignTask: false,
                indexForUpdate: 0
            });
        }
    }
}

export const editTaskSer = (current, data, index) => {
    var deep = _.cloneDeep(data);
    current.setState({
        assignTask: true,
        indexForUpdate: index + 1,
        ForButton: "Edit",
        taskName: data?.type === "task" ?
            { value: "task", label: "Task" } :
            { label: 'Assign Service', value: 'assign_service' }
    })
    if (data?.type === "assign_service") {
        var services1 = data && data.services.length > 0 && data.services.map((item) => {
            return { label: item?.service, value: item?.price };
        })
        current.setState({
            allSequence: deep,
            allSequence1: services1
        })
    } else {
        current.setState({
            allSequence: deep,
        });
    }
}

export const removeServices = (current, index, data) => {
    let translate = getLanguage(current.props.stateLanguageType);
    let { RemoveService, RemoveTask, sure_remove_task, sure_remove_service, from_therapy, No, Yes, Atleast_select_two_sequence } =
        translate;
    const { seqItems } = current.state;
    current.setState({ errorMsg: "" });
    if (seqItems?.length > 2 && index > -1) {
        current.setState({ openServ: false });
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div
                        className={
                            current.props.settings &&
                                current.props.settings.setting &&
                                current.props.settings.setting.mode &&
                                current.props.settings.setting.mode === 'dark'
                                ? 'dark-confirm react-confirm-alert-body'
                                : 'react-confirm-alert-body'
                        }
                    >
                        <h1>{data?.type === "task" ? RemoveTask : RemoveService}</h1>
                        <p>{data?.type === "task" ? `${sure_remove_task} ${from_therapy}` : `${sure_remove_service} ${from_therapy}`}</p>
                        <div className="react-confirm-alert-button-group">

                            <button onClick={() => {
                                onClose();
                                current.setState({ openServ: true });
                            }}
                            >
                                {No}
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    removeTaskSer(current, index);
                                    current.setState({ openServ: true });
                                }}
                            >
                                {Yes}
                            </button>
                        </div>
                    </div >
                );
            },
        });
    }
    else {
        current.setState({ error_section: 2, errorMsg: Atleast_select_two_sequence })
    }
};

//Delete Listing from Array
export const removeTaskSer = (current, index) => {
    const { seqItems } = current.state;
    seqItems.splice(index, 1);
    current.setState({ seqItems });
}
// For searching data
export const searchFilter = (e, current) => {
    current.setState({ SearchValue: e.target.value });
    if (current.state.showinput && e.target.value) {
        axios
            .get(
                sitedata.data.path + "/vt/Gettherapy_search/" + current.props?.House?.value + "/" + e.target.value,
                commonHeader(current.props.stateLoginValueAim?.token)
            )
            .then((res) => {
                if (res.data.hassuccessed) {
                    current.setState({
                        AllTherpy: res?.data?.data,
                    });
                }
            })
            .catch(() => {
            })
    }
    else {
        getAllTherpy(current);
    }
}

export const onChangePage = (pageNumber, current) => {
    current.setState({
        AllTherpy: current.state.AllTherpy1.slice(
            (pageNumber - 1) * 10,
            pageNumber * 10
        ),
        currentPage: pageNumber,
    });
};

//to get the speciality list
export const specailityList = (current) => {
    var spec =
        current.props.speciality?.SPECIALITY &&
        current.props?.speciality?.SPECIALITY.length > 0 &&
        current.props?.speciality?.SPECIALITY.map((data) => {
            return { label: data.specialty_name, value: data._id };
        });
    current.setState({ specilaityList: spec ? spec : [] });
};

export const onFieldChange = (current, e) => {
    const state = current.state.updateTrack;
    current.setState({ selectSpec: e });
    var speciality =
        current.props.speciality?.SPECIALITY &&
        current.props?.speciality?.SPECIALITY.length > 0 &&
        current.props?.speciality?.SPECIALITY.filter((data) => data._id === e.value);
    if (speciality && speciality.length > 0) {
        state["speciality"] = {
            background_color: speciality[0]?.background_color,
            color: speciality[0]?.color,
            specialty_name: speciality[0]?.specialty_name,
            _id: speciality[0]?._id,
        };
        current.setState({ updateTrack: state });
    }
};

// Manage assign to list
export const selectProf = (current, listing, data) => {
    var showdata = data;
    var alredyAssigned =
        listing &&
        listing?.length > 0 &&
        listing.map((item) => {
            return item.user_id || item._id;
        });
    if (alredyAssigned && alredyAssigned.length > 0) {
        showdata =
            data?.length > 0 &&
            data.filter((item) => !alredyAssigned.includes(item.value));
        var assignedto =
            data?.length > 0 &&
            data.filter((item) => alredyAssigned.includes(item.value));
        current.setState({ assignedTo: assignedto });
    }
    current.setState({ professional_id_list1: showdata });
};

//get services list
export const getAssignService = (current) => {
    var serviceList = [],
        serviceList1 = [];
    axios
        .get(
            sitedata.data.path + '/vh/GetService/' + current.props?.House?.value,
            commonHeader(current.props.stateLoginValueAim.token)
        )
        .then((response) => {
            current.setState({ allServData: response.data.data });
            for (let i = 0; i < current.state.allServData.length; i++) {
                serviceList1.push(current.state.allServData[i]);
                serviceList.push({
                    value: current.state.allServData[i].price,
                    label: current.state.allServData[i]?.title,
                });
            }
            current.setState({
                service_id_list: serviceList,
                serviceList1: serviceList1,
            });
        });
};

// Add Service
export const onFieldChange1 = (current, e, name) => {
    current.setState({ allSequence1: e }, () => {
        var services = [];
        var a = e && e.length > 0 && e.map((item) => {
            return services.push({
                service: item?.label,
                price_per_quantity: item?.value,
                price: item?.value,
                quantity: 1
            })
        })
        current.setState({
            // updateTrack: state,
            allSequence2: services
        });
    })
    // const state = current.state.updateTrack;
    // const state1 = current.state.allSequence;
    // if (name === 'service') {
    //     if (e.value === 'custom') {
    //         current.setState({ viewCutom: true });
    //     } else {
    //         current.setState({ viewCutom: false });
    //     }
    //     state1['price_per_quantity'] = e.value;
    //     state1['quantity'] = 1;
    //     state1[name] = e;
    // } else if (name === 'quantity') {
    //     state1['quantity'] = parseInt(e);
    // }
    // else {
    //     state[name] = e;
    // }

};

export const GetStaffListing = (current, data, team_name) => {
    var staff = { staff: data.staff };
    current.setState({ loaderImage: true });
    axios
        .post(
            sitedata.data.path + "/teammember/GetTeamStaff",
            staff,
            commonHeader(current.props.stateLoginValueAim.token)
        )
        .then((responce) => {
            if (responce.data.hassuccessed) {
                current.setState({ loaderImage: false, AllStaffData: { AllStaffData1: responce?.data?.data, team_name: team_name }, openStaff: true });
            }
        })
        .catch(() => {
            current.setState({ loaderImage: false });
        })
}
