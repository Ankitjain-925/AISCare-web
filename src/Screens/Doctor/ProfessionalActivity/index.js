import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LeftMenu from 'Screens/Components/Menus/DoctorLeftMenu/index';
import LeftMenuMobile from 'Screens/Components/Menus/DoctorLeftMenu/mobile';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LoginReducerAim } from 'Screens/Login/actions';
import { Settings } from 'Screens/Login/setting';
import axios from 'axios';
import { LanguageFetchReducer } from 'Screens/actions';
import { Speciality } from 'Screens/Login/speciality.js';
import sitedata from 'sitedata';
import { commonHeader } from 'component/CommonHeader/index';
import { authy } from 'Screens/Login/authy.js';
import { houseSelect } from 'Screens/VirtualHospital/Institutes/selecthouseaction.js';
import Loader from 'Screens/Components/Loader/index';
import { Redirect, Route } from 'react-router-dom';
// import Notification from 'Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications';
import TaskSectiuonVH from 'Screens/Components/VirtualHospitalComponents/TaskSectionVH';
import { getLanguage } from 'translations/index';
import { filterPatient } from 'Screens/Components/BasicMethod/index';
import moment from 'moment'

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
      q: '',
      selectedUser: '',
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
      Fileadd: '',
      AllTasks: {},
      shown: false,
      professionalArray: [],
      ArchivedTasks: [],
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
    // this.getAddTaskData();
    this.getAllactivities();
    this.allHouses();
  }

  allHouses = () => {
    this.setState({ loaderImage: true });
    let user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.stateLoginValueAim.user._id;
    axios
      .get(
        sitedata.data.path + "/UserProfile/Users/" + user_id,
        commonHeader(user_token)
      )
      .then((response) => {
        this.setState({ loaderImage: false });
        this.setState({
          currentList: response.data.data.houses,
        });
      })
      .catch((error) => {
        this.setState({ loaderImage: false });
      });
  };

  handleChangeTab = (event, tabvalue) => {
    this.setState({ tabvalue });
  };

  //User list will be show/hide
  toggle = () => {
    this.setState({
      shown: !this.state.shown,
    });
  };

  mySorter(a, b) {
    if (a?.due_on.date && b?.due_on.date) {
      var x = a.due_on.date
      var y = b.due_on.date
      return x > y ? 1 : x < y ? -1 : 0;
    } else {
      return -1;
    }
  }
  mySorter1(a, b) {
    if (a?.date && b.date) {
      var x = a.date
      var y = b.date
      return x > y ? 1 : x < y ? -1 : 0;
    } else {
      return -1;
    }
  }
  //get Add task data
  getAddTaskData = (tabvalue2, goArchive) => {
    this.setState({ loaderImage: true });
    axios
      .get(
        sitedata.data.path +
        "/assignservice/getAllactivities/" + this.props.stateLoginValueAim?.user?._id +'/'+ this.props.stateLoginValueAim?.user?.profile_id,
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((response) => {
        this.setState({ AllTasks: response.data.data });
        if (response.data.hassuccessed) {
          if (response?.data?.data) {
            var patientForFilterArr = filterPatient(response.data.data);
            this.setState({ patientForFilter: patientForFilterArr });
          }
          var services = response.data.data

          let today = new Date().setHours(0, 0, 0, 0);
          let ttime = moment().format("HH:mm");
          var Done =
            services?.length > 0 &&
            services.filter((item) => {
              if (item.task_name) {
                return item.status === "done"
              }
              else {
                let data_end = moment(item.end_time).format("HH:mm");
                let data_d = new Date(item.date).setHours(0, 0, 0, 0)

                if (item?.end_time && (moment(today).isAfter(data_d) || (moment(today).isSame(data_d) && data_end >= ttime))) {
                  return item
                } else {
                  return item.status === "done"
                }

              }
            });
          // var Done =
          // response.data.data?.length > 0 &&
          //   response.data.data.filter((item) => item.status === "done");
          var Open =
            response.data.data?.length > 0 &&
            response.data.data.filter((item) => {
              if (item.task_name) {
                return item.status === "open"
              }
              else {
                let data_end = moment(item.end_time).format("HH:mm");
                let data_d = new Date(item.date).setHours(0, 0, 0, 0)
                if (item?.end_time && (moment(today).isBefore(data_d) || (moment(today).isSame(data_d) && data_end < ttime))) {
                  return item
                } else {
                  return item.status === "open"
                }

              }
            });
          this.setState({
            AllTasks: services,
            DoneTask: Done,
            OpenTask: Open,
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


  getAllactivities = (tabvalue2, goArchive) => {
    this.setState({ loaderImage: true });
    axios
      .get(
        sitedata.data.path +
        "/assignservice/getAllactivities/" + this.props.stateLoginValueAim?.user?._id + "/" + this.props.stateLoginValueAim?.user?.profile_id,
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((response) => {
        this.setState({ AllTasks: response.data.data });
        if (response.data.hassuccessed) {
          if (response?.data?.data) {
            var patientForFilterArr = filterPatient(response.data.data);
            this.setState({ patientForFilter: patientForFilterArr });
          }
          var Done =
            response.data.data?.length > 0 &&
            response.data.data.filter((item) => item.status === "done" || item.status === "Done")

          var Open =
            response.data.data?.length > 0 &&
            response.data.data.filter(
              (item) => item.status !== "done" || (item.appointment_type && item.status !== "done")
            );
          var ArchivedTask = response.data.data?.length > 0 &&
            response.data.data.filter((item) => item.archived);
          this.setState({
            AllTasks: response.data.data,
            DoneTask: Done,
            OpenTask: Open,
            ArchivedTasks: ArchivedTask
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


  render() {
    let translate = getLanguage(this.props.stateLanguageType);
    let { Professional_activities } = translate;
    const { stateLoginValueAim, Doctorsetget } = this.props;
    if (
      stateLoginValueAim.user === 'undefined' ||
      stateLoginValueAim.token === 450 ||
      stateLoginValueAim.token === 'undefined' ||
      stateLoginValueAim.user.type !== 'doctor' ||
      !this.props.verifyCode ||
      !this.props.verifyCode.code
    ) {
      return <Redirect to={'/'} />;
    }
    return (
      <Grid
        className={
          this.props.settings &&
            this.props.settings.setting &&
            this.props.settings.setting.mode &&
            this.props.settings.setting.mode === 'dark'
            ? 'homeBg darkTheme'
            : 'homeBg'
        }
      >
        {this.state.loaderImage && <Loader />}
        <Grid className="homeBgIner">
          <Grid container direction="row" justify="center">
            <Grid item xs={12} md={12}>
              <Grid container direction="row">
                {/* Website Menu */}
                <LeftMenu isNotShow={true} currentPage="activity" />
                <LeftMenuMobile isNotShow={true} currentPage="activity" />
                {/* <Notification /> */}
                {/* End of Website Menu */}
                <Grid item xs={12} md={11}>
                  <Grid className="topLeftSpc">
                    <Grid container direction="row">
                      <Grid item xs={11} md={11}>
                        <Grid container direction="row">
                          <Grid item xs={12} md={6} className="spcMgntH1">
                            <h1>{Professional_activities}</h1>
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
                          this.getAllactivities(tabvalue2, goArchive);
                        }}
                        AllTasks={this.state.AllTasks}
                        DoneTask={this.state.DoneTask}
                        OpenTask={this.state.OpenTask}
                        ArchivedTasks={this.state.ArchivedTasks}
                        comesFrom={'Professional'}
                        tabvalue2={this.state.tabvalue2}
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
