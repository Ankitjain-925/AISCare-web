import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Assigned from 'Screens/Components/VirtualHospitalComponents/Assigned/index';
import LeftMenu from "Screens/Components/Menus/VirtualHospitalMenu/index";
import LeftMenuMobile from "Screens/Components/Menus/VirtualHospitalMenu/mobile";
import VHfield from "Screens/Components/VirtualHospitalComponents/VHfield/index";
import Modal from "@material-ui/core/Modal";
import Pagination from "Screens/Components/Pagination/index";
import { withRouter } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";
import { authy } from "Screens/Login/authy.js";
import { connect } from "react-redux";
import { LanguageFetchReducer } from "Screens/actions";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { houseSelect } from "../Institutes/selecthouseaction";
import Loader from "Screens/Components/Loader/index";
import Select from "react-select";
import {
    updateEntryState1,
    getSpecialty
} from "../../VirtualHospital/Services/api";
import { getLanguage } from "translations/index";
import {
    handleSubmit,
    handleOpenServ,
    handleCloseServ,
    getAllTherpy,
    EditTherapy,
    DeleteTherapy,
    GetProfessionalData,
    updateEntryState3,
    taskSelection,
    updateEntry,
    handleAddData,
    editTaskSer,
    removeServices,
    onChangePage,
    searchFilter,
    specailityList,
    onFieldChange,
    getAssignService,
    onFieldChange1,
    GetStaffListing
} from "./api"
import ViewTherapy from "./ViewTherapy";
import FilterTherapyDiases from "./FilterTherapyDiases";
import { Speciality } from "Screens/Login/speciality.js";
import Therapies from "Screens/Components/VirtualHospitalComponents/Therapy/index";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openServ: false,
            updateTrack: {},
            errorMsg: "",
            SearchValue: "",
            AddTaskSection: [
                { value: 'task', label: 'Task' },
                { value: 'assign_service', label: 'Assign Service' }
            ],
            allSequence: {},
            seqItems: [],
            indexForUpdate: 0,
            error_section: 0,
            assignedTo: [],
            selectSpec: {},
            ForButton: "",
            currentTherapy: {},
            openAss1: false,
            allSequence1: []
        };
    }

    componentDidMount() {
        getSpecialty(this);
        getAllTherpy(this);
        GetProfessionalData(this);
        specailityList(this);
        getAssignService(this);
    }

    clearFilter = () => {
        this.setState({
            AllTaskCss: "",
            openFilter: false
        });
    }

    closeFullPatient = () => {
        this.setState({
            openAssPat: false
        });
    }

    applyFilter = () => {
        this.setState({
            AllTaskCss: "filterApply",
            openFilter: false
        });
    }
    handleOpenAss1 = (currentTherapy) => {
        this.setState({ openAss1: true, currentTherapy: currentTherapy });
    };

    handleCloseAss1 = () => {
        this.setState({ openAss1: false, currentTherapy: {} })
    }

    handleOpenAssPat = () => {
        this.setState({ openAssPat: true });
    }

    // Closing View Therapy
    closeFullQues = () => {
        this.setState({ viewTher: false });
    }

    // Closing Filter
    closeFullFilter = () => {
        this.setState({ openFilter: false });
    }

    // Open Show staff Modal
    showData = (data, team_name) => {
        GetStaffListing(this, data, team_name);
    }

    // Closing Show staff Modal
    closeStaffInfo = () => {
        this.setState({ openStaff: false });
    }

    render() {
        let translate = getLanguage(this.props.stateLanguageType);
        let {
            Add,
            Addservice,
            Searchserviceoraddcustominput,
            Speciallity,
            Assignedto,
            Search_Select,
            Addnewtherapy,
            Therapy,
            addtherapy,
            save_and_close,
            EnterTherapyname,
            editTherapy,
            viewTherapy,
            deleteTherapy,
            assign_to_patient,
            DiseaseName,
            Enterdiseasename,
            therapy_name,
            total_task_or_services,
            Entertherapyshortdescription,
            Therapyshortdescription,
            Therapyname,
            Search,
            Sequence_Task_Assigned_Services,
            No,
            Type,
            Name,
            Edit_Delete,
            Add_Sequences,
            Task_Name,
            Task_Description,
            Assignedtitle,
            no_data_avlbl,
            Duplicate_Therapy,
            showing_therapy
        } = translate;
        const { AllTherpy, assignTask, taskName, viewAllData, error_section, ForButton, viewTher, openStaff } = this.state;
        const { stateLoginValueAim, House } = this.props;
        if (
            stateLoginValueAim.user === "undefined" ||
            stateLoginValueAim.token === 450 ||
            stateLoginValueAim.token === "undefined" ||
            stateLoginValueAim.user.type !== "adminstaff" ||
            !this.props.verifyCode ||
            !this.props.verifyCode.code
        ) {
            return <Redirect to={"/"} />;
        }
        if (House && House?.value === null) {
            return <Redirect to={"/VirtualHospital/institutes"} />;
        }

        const { House: { roles = [] } = {} } = this.props || {}
        return (
            <Grid
                className={
                    this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === "dark"
                        ? "homeBg darkTheme"
                        : "homeBg"
                }
            >
                <Grid className="homeBgIner vh-section">
                    {this.state.loaderImage && <Loader />}
                    <Grid container direction="row">
                        <Grid item xs={12} md={12}>

                            {/* Mobile menu */}
                            <LeftMenuMobile isNotShow={true} currentPage="more" />
                            <Grid container direction="row">
                                {/* Start of Menu */}
                                <Grid item xs={12} md={1} className="MenuLeftUpr">
                                    <LeftMenu isNotShow={true} currentPage="more" />
                                </Grid>
                                {/* End of Menu */}

                                {/* Start of Right Section */}
                                <Grid item xs={12} md={10}>
                                    <Grid className="topLeftSpc">
                                        <Grid container direction="row">
                                            <Grid item xs={6} md={6}>
                                                {/* Back common button */}
                                                {/* End of Back common button */}
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Grid className="openAssser"> <Grid className="newServc">
                                                    {roles.includes('add_therapy') &&
                                                        <Button onClick={() => handleOpenServ(this)}>
                                                            {addtherapy}
                                                        </Button>}
                                                    <Modal
                                                        open={this.state.openServ}
                                                        onClose={() => handleCloseServ(this)}
                                                        className={
                                                            this.props.settings.setting &&
                                                                this.props.settings.setting.mode &&
                                                                this.props.settings.setting.mode === "dark"
                                                                ? "darkTheme addSpeclModel"
                                                                : "addSpeclModel"
                                                        }
                                                    >
                                                        <Grid
                                                            className={
                                                                this.props.settings &&
                                                                    this.props.settings.setting &&
                                                                    this.props.settings.setting.mode &&
                                                                    this.props.settings.setting.mode === "dark"
                                                                    ? "darkTheme addSpeclContnt"
                                                                    : "addServContnt"
                                                            }
                                                        >
                                                            <Grid className="addSpeclContntIner1">
                                                                <Grid className="addSpeclLbl">
                                                                    <Grid
                                                                        container
                                                                        direction="row"
                                                                        justify="center"
                                                                    >
                                                                        <Grid item xs={8} md={8} lg={8}>
                                                                            <label>{Addnewtherapy}</label>
                                                                        </Grid>
                                                                        <Grid item xs={4} md={4} lg={4}>
                                                                            <Grid>
                                                                                <Grid className="entryCloseBtn">
                                                                                    <a
                                                                                        onClick={() =>
                                                                                            handleCloseServ(this)
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            src={require("assets/images/close-search.svg")}
                                                                                            alt=""
                                                                                            title=""
                                                                                        />
                                                                                    </a>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                {error_section === 1 &&
                                                                    <div className="error_message">
                                                                        {this.state.errorMsg}
                                                                    </div>}
                                                                <Grid className="enterServMain">
                                                                    <Grid className="enterSpcl">
                                                                        <Grid>
                                                                            <VHfield
                                                                                label={Therapyname}
                                                                                name="therapy_name"
                                                                                placeholder={EnterTherapyname}
                                                                                onChange={(e) =>
                                                                                    updateEntryState1(e, this)
                                                                                }
                                                                                value={this.state.updateTrack?.therapy_name}
                                                                            />
                                                                        </Grid>

                                                                        <Grid>
                                                                            <VHfield
                                                                                label={Therapyshortdescription}
                                                                                name="therapy_description"
                                                                                placeholder={
                                                                                    Entertherapyshortdescription
                                                                                }
                                                                                onChange={(e) =>
                                                                                    updateEntryState1(e, this)
                                                                                }
                                                                                value={
                                                                                    this.state.updateTrack?.therapy_description
                                                                                }
                                                                            />
                                                                        </Grid>

                                                                        <Grid>
                                                                            <VHfield
                                                                                label={DiseaseName}
                                                                                name="disease_name"
                                                                                placeholder={
                                                                                    Enterdiseasename
                                                                                }
                                                                                onChange={(e) =>
                                                                                    updateEntryState1(e, this)
                                                                                }
                                                                                value={
                                                                                    this.state.updateTrack?.disease_name
                                                                                }
                                                                            />
                                                                        </Grid>

                                                                        <Grid item xs={12} md={12} className="assignSection">
                                                                            <label>{Assignedto}</label>
                                                                            <Grid>
                                                                                <Select
                                                                                    name="professional"
                                                                                    onChange={(e) => updateEntryState3(e, this)}
                                                                                    value={this.state.assignedTo || ''}
                                                                                    options={this.state.professional_id_list1}
                                                                                    placeholder={Search_Select}
                                                                                    className="addStafSelect"
                                                                                    isMulti={true}
                                                                                    isSearchable={true}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid item xs={12} md={12}>
                                                                            <label>{Speciallity}</label>
                                                                            <Grid className="specialFor">
                                                                                <Select
                                                                                    onChange={(e) => onFieldChange(this, e)}
                                                                                    options={this.state.specilaityList}
                                                                                    name="specialty_name"
                                                                                    placeholder={Search_Select}
                                                                                    isSearchable={true}
                                                                                    className="addStafSelect"
                                                                                    value={
                                                                                        this.state.selectSpec
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid className="addSrvcBtn3" >
                                                                            <h3 className="service-head">{Sequence_Task_Assigned_Services}</h3>
                                                                        </Grid>
                                                                        {error_section === 2 &&
                                                                            <div className="error_message">
                                                                                {this.state.errorMsg}
                                                                            </div>}

                                                                        <Grid item xs={12} md={12}>
                                                                            <Grid className="wardsGrup3">
                                                                                {/* {this.state.taskData?.length > 0 && */}
                                                                                <Grid className="roomsNum3 roomsNum3345">
                                                                                    <Grid container direction="row">
                                                                                        <Grid item xs={12} md={12} className="services-head">
                                                                                            {/* <b>Tasks</b> */}
                                                                                            <table border="0">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th className="noNameTypeEditDel1">{No}</th>
                                                                                                        <th className="noNameTypeEditDel2">{Type}</th>
                                                                                                        <th className="noNameTypeEditDel3">{Name}</th>
                                                                                                        <th className="noNameTypeEditDel4">{Edit_Delete}</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                {this.state.seqItems.map((item, index) => {
                                                                                                    return <tbody>
                                                                                                        <tr>
                                                                                                            <td className="noNameTypeEditDel5" key={index}>{index + 1}</td>
                                                                                                            <td className="noNameTypeEditDel6" key={index}>{item?.type === "task" ? "Task" : "Assign Service"}</td>
                                                                                                            <td className="noNameTypeEditDel7" key={index}>{item?.task_name || item?.title}</td>
                                                                                                            <td className="noNameTypeEditDel8" key={index}>
                                                                                                                <Grid className="setEditDelBut">
                                                                                                                    <img
                                                                                                                        className="imgEditDelPer"
                                                                                                                        onClick={() => {
                                                                                                                            editTaskSer(this, item, index);
                                                                                                                        }}
                                                                                                                        src={require("assets/virtual_images/pencil-1.svg")}
                                                                                                                        alt=""
                                                                                                                        title=""
                                                                                                                    />
                                                                                                                    <img
                                                                                                                        className="imgEditDelPer"
                                                                                                                        onClick={() => {
                                                                                                                            removeServices(this, index, item);
                                                                                                                        }}
                                                                                                                        src={require("assets/virtual_images/bin.svg")}
                                                                                                                        alt=""
                                                                                                                        title=""
                                                                                                                    />
                                                                                                                </Grid>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                })}
                                                                                            </table>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>

                                                                        <Grid className="addSrvcBtn3" >
                                                                            <h3 className="service-head headService11">
                                                                                <a onClick={() => { this.setState({ assignTask: true, allSequence: {}, taskName: {}, ForButton: Add, allSequence1: [] }) }}>{Add_Sequences}</a>
                                                                            </h3>
                                                                        </Grid>
                                                                        {error_section === 3 &&
                                                                            <div className="error_message">
                                                                                {this.state.errorMsg}
                                                                            </div>}

                                                                        {assignTask &&
                                                                            <Grid className="headService11">
                                                                                <label>{Type}</label>
                                                                                <Select
                                                                                    name="type"
                                                                                    options={this.state.AddTaskSection}
                                                                                    placeholder={Search_Select}
                                                                                    onChange={(e) => taskSelection(this, e)}
                                                                                    value={this.state.taskName}
                                                                                    className="addStafSelect"
                                                                                    isMulti={false}
                                                                                    isSearchable={true}
                                                                                />
                                                                            </Grid>
                                                                        }

                                                                        {taskName?.value === "task" &&
                                                                            <Grid className="headService11">
                                                                                <VHfield
                                                                                    label={Task_Name}
                                                                                    name="task_name"
                                                                                    placeholder={Task_Name}
                                                                                    onChange={(e) => updateEntry(this, e)}
                                                                                    value={this.state?.allSequence?.task_name || ""}
                                                                                />                                                                          
                                                                                <p className="err_message">{this.state.errorTaskName}</p>
                                                                                <VHfield
                                                                                    label={Task_Description}
                                                                                    name="task_description"
                                                                                    placeholder={Task_Description}
                                                                                    onChange={(e) => updateEntry(this, e)}
                                                                                    value={this.state?.allSequence?.task_description || ""}
                                                                                />
                                                                                <p className="err_message">{this.state.errorTaskDesc}</p>
                                                                            </Grid>}
                                                                        {taskName?.value === "assign_service" &&
                                                                            <Grid className="headService11">
                                                                                <VHfield
                                                                                    label={Assignedtitle}
                                                                                    name="title"
                                                                                    placeholder="Enter Title"
                                                                                    onChange={(e) => updateEntry(this, e)}
                                                                                    value={this.state?.allSequence?.title || ""}
                                                                                />
                                                                                <label>{Addservice}</label>
                                                                                <Select
                                                                                    name="service"
                                                                                    onChange={(e) => onFieldChange1(this, e, 'service')}
                                                                                    value={this.state.allSequence1 || ''}
                                                                                    className="addStafSelect"
                                                                                    options={this.state.service_id_list}
                                                                                    placeholder={Searchserviceoraddcustominput}
                                                                                    isSearchable={true}
                                                                                    isMulti={true}
                                                                                />
                                                                                {/* <Grid item xs={12} md={12} className="customservicetitle">
                                                                                    <VHfield
                                                                                        label={Quantity}
                                                                                        name="quantity"
                                                                                        placeholder={Enterquantity}
                                                                                        onChange={(e) =>
                                                                                            onFieldChange1(this, e.target.value, 'quantity')
                                                                                        }
                                                                                        value={this.state.allSequence?.quantity || 0}
                                                                                    />
                                                                                </Grid> */}

                                                                                {/* <Grid
                                                                                    item
                                                                                    xs={12}
                                                                                    md={12}
                                                                                    className="enterPricePart1 customservicetitle"
                                                                                >
                                                                                    <VHfield
                                                                                        label={Price}
                                                                                        name="price_per_quantity"
                                                                                        placeholder={Enterserviceprice}
                                                                                        onChange={(e) =>
                                                                                            onFieldChange1(
                                                                                                this,
                                                                                                e.target.value,
                                                                                                'price_per_quantity'
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            this.state?.allSequence?.price_per_quantity || 0
                                                                                        }
                                                                                        disabled={true}
                                                                                    />
                                                                                    <p className="enterPricePart3">€</p>
                                                                                </Grid> */}

                                                                                {/* <Grid className="totalamount">
                                                                                    <p>{ServiceAmount}</p>
                                                                                    <label>{this.state?.total_amount} €</label>

                                                                                </Grid> */}
                                                                            </Grid>
                                                                        }
                                                                        {taskName?.value && <Grid className="addSrvcBtn3" >
                                                                            <h3 className="service-head headService11">
                                                                                <a onClick={() => { handleAddData(this) }}>{taskName?.value === "task" ? `${ForButton} Task` : `${ForButton} Service`}</a>
                                                                            </h3>
                                                                        </Grid>}
                                                                    </Grid>
                                                                </Grid>

                                                                <Grid className="servSaveBtn">
                                                                    <a>
                                                                        <Button
                                                                            onClick={() => handleSubmit(this)}
                                                                        >
                                                                            {save_and_close}
                                                                        </Button>
                                                                    </a>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Modal>
                                                </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Start of Bread Crumb */}
                                        <Grid className="breadCrumbUpr">
                                            <Grid container direction="row" alignItems="center">
                                                <Grid item xs={12} md={9}>
                                                    <Grid className="roomBreadCrumb medcalCntr">
                                                        <ul>
                                                            <li>
                                                                <a>
                                                                    <label>{Therapy}</label>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Grid className="settingInfo">
                                                        {this.state.showinput && (
                                                            <input
                                                                name="Search"
                                                                placeholder={Search}
                                                                value={this.state.SearchValue}
                                                                className="serchInput"
                                                                onChange={(e) => searchFilter(e, this)}
                                                            />
                                                        )}
                                                        <a>
                                                            {!this.state.showinput ? (
                                                                <img
                                                                    src={require("assets/virtual_images/search-entries.svg")}
                                                                    alt=""
                                                                    title=""
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showinput: !this.state.showinput,
                                                                        });
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={require("assets/images/close-search.svg")}
                                                                    alt=""
                                                                    title=""
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showinput: !this.state.showinput,
                                                                            SearchValue: "",
                                                                        });
                                                                        getAllTherpy(this);
                                                                    }}
                                                                />
                                                            )}
                                                        </a>

                                                        {/* <a>
                                                            <img
                                                                src={
                                                                    AllTaskCss === 'filterApply'
                                                                        ? require('assets/virtual_images/sort-active.png')
                                                                        : require('assets/virtual_images/sort.png')
                                                                }
                                                                alt=""
                                                                title=""
                                                                onClick={() => {
                                                                    this.setState({
                                                                        openFilter: true
                                                                    });
                                                                }}
                                                            />
                                                        </a> */}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* End of Bread Crumb */}
                                        {/* <Grid className="cardioGrup">
                                            <Grid className="cardioGrupBtn">
                                                <Button
                                                    onClick={() => {
                                                        getSpecialtyData(false, this);
                                                    }}
                                                    className={
                                                        !this.state.speciality_id ? "cardioActv" : ""
                                                    }
                                                    variant="contained"
                                                >
                                                    {all}
                                                </Button>
                                            </Grid>
                                        </Grid> */}

                                        {/* service price content */}
                                        {roles.includes('show_therapy') ? <>
                                        <Grid className="srvcTable3">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th><label>{therapy_name}</label></th>
                                                        <th>{DiseaseName}</th>
                                                        <th>{total_task_or_services}</th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {AllTherpy && AllTherpy.length > 0 && AllTherpy.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item?.therapy_name}</td>
                                                            <td>{item?.disease_name}</td>
                                                            <td>{item?.sequence_list?.length}</td>
                                                            <td>
                                                                <Grid className="setAssignedToupper">
                                                                    <Assigned
                                                                        assigned_to={item?.assinged_to}
                                                                        AllStaffData={this.state.AllStaffData}
                                                                        showData={(data, team_name) => this.showData(data, team_name)}
                                                                        openStaff={openStaff}
                                                                        comesFrom="TherapySection"
                                                                    />
                                                                </Grid>
                                                            </td>
                                                            <td className="srvcDots">
                                                                <Grid
                                                                    item
                                                                    xs={6}
                                                                    md={6}
                                                                    className="spcMgntRght7 presEditDot scndOptionIner scndOptionInerPart"
                                                                >
                                                                    <a className="openScndhrf">
                                                                        <img
                                                                            src={require("assets/images/three_dots_t.png")}
                                                                            alt=""
                                                                            title=""
                                                                            className="openScnd specialuty-more"
                                                                        />

                                                                        <ul>
                                                                            <li onClick={() => this.setState({ viewTher: true, viewAllData: item })}
                                                                            >
                                                                                <a>
                                                                                    <img
                                                                                        src={require("assets/virtual_images/pencil-1.svg")}
                                                                                        alt=""
                                                                                        title=""
                                                                                    />
                                                                                    {viewTherapy}
                                                                                </a>
                                                                            </li>


                                                                            {roles.includes('assign_therapy') &&
                                                                                <li onClick={() => { this.handleOpenAss1({ value: item?._id, label: item?.therapy_name }) }}>
                                                                                    <a>
                                                                                        <img
                                                                                            src={require("assets/virtual_images/pencil-1.svg")}
                                                                                            alt=""
                                                                                            title=""
                                                                                        />
                                                                                        {assign_to_patient}
                                                                                    </a>
                                                                                </li>}
                                                                            {roles.includes('edit_therapy') &&
                                                                                <li onClick={() => EditTherapy(this, item)}>
                                                                                    <a>
                                                                                        <img
                                                                                            src={require("assets/virtual_images/pencil-1.svg")}
                                                                                            alt=""
                                                                                            title=""
                                                                                        />
                                                                                        {editTherapy}
                                                                                    </a>
                                                                                </li>}
                                                                                {roles.includes('edit_therapy') &&
                                                                                <li onClick={() => EditTherapy(this, item, true)}>
                                                                                    <a>
                                                                                        <img
                                                                                            src={require("assets/virtual_images/assign-to.svg")}
                                                                                            alt=""
                                                                                            title=""
                                                                                        />{Duplicate_Therapy}
                                                                                    </a>
                                                                                </li>}
                                                                            {roles.includes('delete_therapy') &&
                                                                                <li onClick={() => DeleteTherapy(this, item)}>
                                                                                    <a>
                                                                                        <img
                                                                                            src={require("assets/images/cancel-request.svg")}
                                                                                            alt=""
                                                                                            title=""
                                                                                        />
                                                                                        {deleteTherapy}
                                                                                    </a>
                                                                                </li>}
                                                                        </ul>
                                                                    </a>
                                                                </Grid>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            <Therapies
                                                openAss1={this.state.openAss1}
                                                handleCloseAss={() => this.handleCloseAss1()}
                                                comesFrom={'adminstaff'}
                                                therapy={this.state.currentTherapy}
                                            />

                                            <ViewTherapy
                                                viewTher={viewTher}
                                                item={viewAllData}
                                                closeFullQues={() => this.closeFullQues()}
                                                showData={(data, team_name) => this.showData(data, team_name)}
                                                openStaff={openStaff}
                                                closeStaffInfo={() => this.closeStaffInfo()}
                                                AllStaffData={this.state.AllStaffData}
                                            />
                                            <FilterTherapyDiases
                                                openFilter={this.state.openFilter}
                                                closeFullFilter={() => this.closeFullFilter()}
                                                clearFilter={() => { this.clearFilter() }}
                                                applyFilter={() => { this.applyFilter() }}
                                            />

                                            <Grid className="tablePagNum">
                                                <Grid container direction="row">
                                                    <Grid item xs={12} md={6}>
                                                        <Grid className="totalOutOff">
                                                            {(this.state.currentPage && this.state.totalPage) ? (
                                                                <a>
                                                                    {this.state.currentPage} of{" "}
                                                                    {this.state.totalPage}
                                                                </a>) : (<div className="err_message">{no_data_avlbl}</div>)
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        {this.state.totalPage > 1 && (
                                                            <Grid className="prevNxtpag">
                                                                <Pagination
                                                                    totalPage={this.state.totalPage}
                                                                    currentPage={this.state.currentPage}
                                                                    pages={this.state.pages}
                                                                    onChangePage={(page) => {
                                                                        onChangePage(page, this);
                                                                    }}
                                                                />
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid></>:<p className='authority'>{showing_therapy}</p>
                                        }
                                        {/* end of service price content */}
-                                    </Grid>
                                </Grid>
                                {/* End of Right Section */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
const mapStateToProps = (state) => {
    const { stateLoginValueAim, loadingaIndicatoranswerdetail } = state.LoginReducerAim;
    const { stateLanguageType } = state.LanguageReducer;
    const { House } = state.houseSelect;
    const { settings } = state.Settings;
    const { verifyCode } = state.authy;
    const { speciality } = state.Speciality;
    return {
        stateLanguageType,
        stateLoginValueAim,
        loadingaIndicatoranswerdetail,
        settings,
        verifyCode,
        House,
        speciality,
    };
};
export default withRouter(
    connect(mapStateToProps, {
        LoginReducerAim,
        LanguageFetchReducer,
        Settings,
        authy,
        houseSelect,
        Speciality,
    })(Index)
);
