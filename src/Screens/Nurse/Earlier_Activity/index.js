import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import LeftMenu from "Screens/Components/Menus/NurseLeftMenu/index";
import LeftMenuMobile from "Screens/Components/Menus/NurseLeftMenu/mobile";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import axios from "axios";
import { LanguageFetchReducer } from "Screens/actions";
import { Speciality } from "Screens/Login/speciality.js";
import sitedata from "sitedata";
import { commonHeader } from "component/CommonHeader/index";
import { authy } from "Screens/Login/authy.js";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction.js";
import Loader from "Screens/Components/Loader/index";
import { Redirect, Route } from "react-router-dom";
// import Notification from "Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications";
import TaskSectiuonVH from "Screens/Components/VirtualHospitalComponents/TaskSectionVH";
import { getLanguage } from "translations/index"
import { filterPatient } from "Screens/Components/BasicMethod/index";
import moment from 'moment'

import _ from "lodash";


function TabContainer(props) {
    return <Typography component="div">{props.children}</Typography>;
}
TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openTask: false,
            tabvalue: 0,
            tabvalue2: 0,
            q: "",
            selectedUser: "",
            professional_data: [],
            date_format: this.props.date_format,
            time_format: this.props.time_format,
            patient_doc: [],
            patient_doc1: [],
            patient_id_list: [],
            patient_id_list1: [],
            allPatData: [],
            allPatData1: [],
            users: [],
            users1: [],
            openAssign: false,
            newStaff: {},
            ProfMessage: false,
            newTask: {},
            Fileadd: "",
            AllTasks: {},
            shown: false,
            professionalArray: [],
            ArchivedTask: [],
            loaderImage: false,
            hope: false,
            openDate: true,
            specilaityList: [],
            assignedTo: [],
            selectSpec: {},
            open: 0,
            doneToday: 0,
            comments: [],
            newComment: {},
        };
    }

    componentDidMount() {
        this.getAddTaskData();
        // this.getAddTaskData1();
    }

    handleChangeTab = (event, tabvalue) => {
        this.setState({ tabvalue });
    };

    //User list will be show/hide
    toggle = () => {
        this.setState({
            shown: !this.state.shown,
        });
    };
    //get Add task data
    getAddTaskData = async (tabvalue2, goArchive) => {
        this.setState({ loaderImage: true });
        axios
            .get(
                sitedata.data.path +
                "/vc/PastTask/" + this.props.stateLoginValueAim?.user?.profile_id,
                commonHeader(this.props.stateLoginValueAim.token)
            )
            .then(async (response) => {
                this.setState({ AllTasks: response.data.data });
                if (response.data.hassuccessed) {
                    var services = await this.getAddTaskData1();
                    services = [...services.data.data, ...response.data.data]
                    if (response?.data?.data) {
                        var patientForFilterArr = filterPatient(services);
                        this.setState({ patientForFilter: patientForFilterArr });
                    }
                    let current_time = moment().format("HH:mm")
                    services = _.sortBy((
                        _.sortBy(
                            services,
                            (e) => {
                                if (e.appointment_type) {
                                    return e.date
                                }
                                else {
                                    return e.due_on.date
                                }
                            })),
                        (e) => {
                            if (e.appointment_type) {
                                return e.start_time
                            }
                            else {
                                return e.due_on.time
                            }
                        });
                    var Done =
                        services?.length > 0 &&
                        services.filter((item) => {
                            if (item.task_name) {
                                return item.status === "done"
                            }
                            else {
                                return item.status === "done"
                            }
                        });
                    var Open =
                        services?.length > 0 &&
                        services.filter((item) => item.status === "open" || (item.appointment_type || item.status !== "done"));
                    // services.filter((item) => item.status === "open" );
                    var ArchivedTask = services?.length > 0 &&
                        services.filter((item) => item.archived);
                    this.setState({
                        AllTasks: services,
                        DoneTask: Done,
                        OpenTask: Open,
                        ArchivedTask: ArchivedTask
                    });
                    if (goArchive) {
                        this.setState({ tabvalue2: 3 });
                    }
                    else {
                        this.setState({ tabvalue2: tabvalue2 ? tabvalue2 : 0 });
                    }
                }
                this.setState({ loaderImage: false });
            });
    };

    //get Add task data
    getAddTaskData1 = async (uid, data) => {
        var nurse_id = this.props.stateLoginValueAim?.user?._id
        let response = await axios
            .post(
                sitedata.data.path + "/vc/nursebefore",
                { nurse_id: nurse_id },
                commonHeader(this.props.stateLoginValueAim.token)
            )
        if (response.data.hassuccessed) {
            return response
        } else {
            return false
        }
    }

    render() {
        let translate = getLanguage(this.props.stateLanguageType);
        let { Earlier_activities } = translate;
        const { stateLoginValueAim, Doctorsetget } = this.props;
        if (
            stateLoginValueAim.user === "undefined" ||
            stateLoginValueAim.token === 450 ||
            stateLoginValueAim.token === "undefined" ||
            !this.props.verifyCode ||
            !this.props.verifyCode.code
        ) {
            if (stateLoginValueAim.user) {
                if (
                    stateLoginValueAim?.user?.type === "nurse" ||
                    stateLoginValueAim?.user?.type === "therapist"
                ) {
                } else {
                    return <Redirect to={"/"} />;
                }
            } else {
                return <Redirect to={"/"} />;
            }
        }
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
                {this.state.loaderImage && <Loader />}
                <Grid className="homeBgIner">
                    <Grid container direction="row" justify="center">
                        <Grid item xs={12} md={12}>
                            <Grid container direction="row">
                                {/* Website Menu */}
                                <LeftMenu isNotShow={true} currentPage="Earliertask" />
                                <LeftMenuMobile isNotShow={true} currentPage="Earliertask" />
                                {/* <Notification /> */}
                                {/* End of Website Menu */}
                                <Grid item xs={12} md={11}>
                                    <Grid className="topLeftSpc">
                                        <Grid container direction="row">
                                            <Grid item xs={11} md={11}>
                                                <Grid container direction="row">
                                                    <Grid item xs={12} md={6} className="spcMgntH1">
                                                        <h1>{Earlier_activities}</h1>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction="row">
                                        <Grid item xs={12} md={12}>
                                            {/* Model setup */}
                                            <TaskSectiuonVH
                                                patient={this.state.patient}
                                                getAddTaskData={(tabvalue2, goArchive) => {
                                                    this.getAddTaskData(tabvalue2, goArchive);
                                                }}
                                                AllTasks={this.state.AllTasks}
                                                DoneTask={this.state.DoneTask}
                                                OpenTask={this.state.OpenTask}
                                                ArchivedTasks={this.state.ArchivedTask}
                                                comesFrom={"Professional"}
                                                comesFrom1={"earlier_activities"}
                                                removeAddbutton={true}
                                            />
                                            {/* End of Model setup */}
                                        </Grid>
                                    </Grid>
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
        House,
        settings,
        verifyCode,
        speciality,
    };
};
export default withRouter(
    connect(mapStateToProps, {
        LoginReducerAim,
        LanguageFetchReducer,
        Settings,
        houseSelect,
        authy,
        Speciality,
    })(Index)
);
