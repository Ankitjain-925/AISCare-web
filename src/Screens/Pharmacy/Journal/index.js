import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Checkbox from "@material-ui/core/Checkbox";
// import { Editor } from "react-draft-wysiwyg";
import sitedata from "sitedata";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { withRouter } from "react-router-dom";
import { OptionList } from "Screens/Login/metadataaction";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import LeftMenuMobile from "Screens/Components/Menus/PharmaLeftMenu/mobile";
import { Doctorset } from "Screens/Doctor/actions";
import { Settings } from "Screens/Login/setting";
import { Redirect, Route } from "react-router-dom";
import LeftMenu from "Screens/Components/Menus/PharmaLeftMenu/index";
import { LanguageFetchReducer } from "Screens/actions";
import AddEntry from "Screens/Components/AddEntry/index";
import PersonalizedData from "Screens/Components/TimelineComponent/PersonalizedData/index";
import FilterSec from "Screens/Components/TimelineComponent/Filter/index";
import ProfileSection from "Screens/Components/TimelineComponent/ProfileSection/index";
import RightManage from "Screens/Components/TimelineComponent/RightMenuManage/index";
import {
  SortByEntry,
  SortByDiagnose,
  mySorter,
} from "Screens/Components/BasicMethod/index";
import ViewTimeline from "Screens/Components/TimelineComponent/ViewTimeline/index";
import Loader from "Screens/Components/Loader/index.js";
import BPFields from "Screens/Components/TimelineComponent/BPFields/index";
import BSFields from "Screens/Components/TimelineComponent/BSFields/index";
import BMIFields from "Screens/Components/TimelineComponent/BMIFields/index";
import MPFields from "Screens/Components/TimelineComponent/MPFields/index";
import SSFields from "Screens/Components/TimelineComponent/SSFields/index";
import VaccinationFields from "Screens/Components/TimelineComponent/VaccinationFields/index";
import MedicationFields from "Screens/Components/TimelineComponent/MedicationFields/index";
import HVFields from "Screens/Components/TimelineComponent/HVFields/index";
import DVFields from "Screens/Components/TimelineComponent/DVFields/index";
import CPFields from "Screens/Components/TimelineComponent/CPFields/index";
import DiaryFields from "Screens/Components/TimelineComponent/DiaryFields/index";
import AllL_Ps from "Screens/Components/Parameters/parameter.js";
import LRFields from "Screens/Components/TimelineComponent/LRFields/index";
import FUFields from "Screens/Components/TimelineComponent/FUFields/index";
import FAFields from "Screens/Components/TimelineComponent/FAFields/index";
import npmCountryList from "react-select-country-list";
import CovidFields from "Screens/Components/TimelineComponent/CovidFields/index";
import EmptyData from "Screens/Components/TimelineComponent/EmptyData";
import FloatArrowUp from "Screens/Components/FloatArrowUp/index";
import DiagnosisFields from "Screens/Components/TimelineComponent/DiagnosisFields/index";
import moment from "moment";
import GraphView from "Screens/Components/TimelineComponent/GraphView/index";
import { getLanguage } from "translations/index"
import { authy } from "Screens/Login/authy.js";
import { FormatListBulleted } from "@material-ui/icons";
import PFields from "Screens/Components/TimelineComponent/PFields/index.js";
import AnamnesisFields from "Screens/Components/TimelineComponent/AnamnesisFields/index.js";
import SCFields from "Screens/Components/TimelineComponent/SCFields/index.js";
import SOFields from "Screens/Components/TimelineComponent/SOFields/index.js";
// import Notification from "Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications";
import SPECIALITY from "speciality";
import { GetLanguageDropdown } from "Screens/Components/GetMetaData/index.js";
import { get_gender, get_cur_one, get_personalized, download_track, delete_click_track } from "Screens/Components/CommonApi/index";
import { commonHeader } from "component/CommonHeader/index";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDash: false,
      openEntry: false,
      addInqryNw: false,
      addInqrySw: false,
      current_select: "diagnosis",
      updateOne: 0,
      updateTrack: {},
      cur_one: {},
      cur_one2: {},
      personalinfo: {},
      personalised_card: [],
      Alltemprature: [],
      AllATC_code: [],
      Allpain_type: [],
      Allpain_quality: [],
      Pressuresituation: [],
      Allsituation: [],
      Allsmoking_status: [],
      Allreminder: [],
      AllreminderV: [],
      AllSpecialty: [],
      Allsubstance1: [],
      Allrelation: [],
      Allgender: [],
      AllL_P: [],
      Alltime_taken: [],
      added_data: [],
      allTrack: [],
      selectCountry: [],
      visibility: false,
      openData: false,
      gettrackdatas: {},
      Anamnesis: [],
      images: [],
      allTrack1: [],
      allTrack2: [],
      Sort: "diagnosed_time",
      current_Graph: "",
      upcoming_appointment: [],
      error_msg: false,
      defaultValue: 20,
      loading: false,
    };
  }

  LoadMore = (allTrack) => {
    this.setState({ loading: true, defaultValue: this.state.defaultValue + 20 },
      () => {
        this.Showdefaults(allTrack, this.state.defaultValue)
        setTimeout(() => { this.setState({ loading: false }) }, 2000)
      })
  }
  //For render 10 entries at one time 
  Showdefaults = (allTrack, defaultValue) => {
    allTrack = allTrack?.length > 0 && allTrack?.slice(0, defaultValue);
    this.setState({ allTrack: allTrack })
  }
  //For Close the Graph
  CloseGraph = () => {
    this.rightInfo();
    this.getTrack();
    this.setState({ isGraph: false });
  };

  OpenGraph = (current_Graph) => {
    this.setState({ current_Graph: current_Graph, isGraph: true });
  };

  //For clear the filter
  ClearData = () => {
    this.setState(
      { Sort: "diagnosed_time", allTrack2: this.state.allTrack1, allTrack: this.state.allTrack1, defaultValue: 10, },
      () => {
        this.SortData()
        this.Showdefaults(this.state.allTrack2, this.state.defaultValue)
      }
    );
  };

  isThisAvilabel = (object, text) => {
    if (object && typeof object == "object") {
      if (
        object?.type?.replace("_", " ") &&
        object?.type?.replace("_", " ")?.includes(text)
      ) {
        return true;
      } else if (
        object.created_by_temp &&
        object.created_by_temp.includes(text)
      ) {
        return true;
      } else {
        return JSON.stringify(object).toLowerCase().includes(text);
      }
    } else {
      return false;
    }
  };

  FilterText = (text) => {
    let track = this.state.allTrack1;
    let FilterFromSearch =
      track &&
      track.length > 0 &&
      track.filter((obj) => {
        return this.isThisAvilabel(obj, text && text.toLowerCase());
      });
    this.setState({ allTrack2: FilterFromSearch, defaultValue: 20 },
      () => { this.Showdefaults(FilterFromSearch, this.state.defaultValue) });
  };

  //For filter the Data
  FilterData = (time_range, user_type, type, facility_type) => {
    var Datas1 = this.state.allTrack1;
    var FilterFromTime =
      time_range && time_range.length > 0
        ? this.FilterFromTime(Datas1, time_range)
        : Datas1;
    var FilerFromType =
      type && type.length > 0
        ? this.FilerFromType(FilterFromTime, type)
        : FilterFromTime;
    var FilterFromUserType =
      user_type && user_type.length > 0
        ? this.FilterFromUserType(FilerFromType, user_type)
        : FilerFromType;
    if (time_range === null && user_type === null && type === null) {
      FilterFromUserType = this.state.allTrack1;
    }
    FilterFromUserType = [...new Set(FilterFromUserType)];
    this.setState({ allTrack2: FilterFromUserType, defaultValue: 20 },
      () => { this.Showdefaults(FilterFromUserType, this.state.defaultValue) });
  };


  //Filter according to date range
  FilterFromTime = (Datas, time_range) => {
    if (time_range && time_range.length > 0) {
      let start_date = new Date(time_range[0]);
      let end_date = new Date(time_range[1]);
      start_date = start_date.setHours(0, 0, 0, 0);
      end_date = end_date.setDate(end_date.getDate() + 1);
      end_date = new Date(end_date).setHours(0, 0, 0, 0);
      if (Datas && Datas.length > 0) {
        return Datas.filter(
          (obj) =>
            new Date(obj.datetime_on) >= start_date &&
            new Date(obj.datetime_on) <= end_date
        );
      } else {
        return [];
      }
    } else {
      return null;
    }
  };

  //Filter according to the type
  FilerFromType = (Datas, type) => {
    var Datas1 = [];
    if (type && type.length > 0) {
      type.map((ob) => {
        var dts = Datas.filter((obj) => obj.type === ob.value);
        Datas1 = Datas1.concat(dts);
      });
      return Datas1;
    } else {
      return null;
    }
  };

  //Filter according to User type
  FilterFromUserType = (Datas, user_type) => {
    var Datas1 = [];
    if (Datas && Datas.length > 0) {
      if (user_type && user_type.length > 0) {
        user_type.map((ob) => {
          var dts = Datas?.filter(
            (obj) => obj?.created_by_temp?.indexOf(ob.value) > -1
          );
          Datas1 = Datas1.concat(dts);
        });
        return Datas1;
      }
    }
    return null;
  };

  //For Sort the Data
  SortData = (data) => {
    if (data === "entry_time") {
      this.state.allTrack.sort(SortByEntry);
    } else {
      this.state.allTrack.sort(SortByDiagnose);
    }
    this.setState({ Sort: data });
  };

  //Modal Open on Archive the Journal
  ArchiveTrack = (data) => {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      archive_item,
      do_u_really_want_archive_item,
      r_u_sure_remove_doctor,
      yes,
      no,
    } = translate;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                ? "dark-confirm react-confirm-alert-body"
                : "react-confirm-alert-body"
            }
          >
            <h1>{archive_item}</h1>
            <p>{do_u_really_want_archive_item}</p>
            <div className="react-confirm-alert-button-group">
              <button
                onClick={() => {
                  this.updateArchiveTrack(data);
                  onClose();
                }}
              >
                {yes}
              </button>
              <button
                onClick={() => {
                  onClose();
                }}
              >
                {no}
              </button>
            </div>
          </div>
        );
      },
    });
  };
  //Delete the perticular track confirmation box
  DeleteTrack = (deletekey) => {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      delete_item,
      do_u_really_want_delete_item,
      r_u_sure_remove_doctor,
      yes,
      no,
    } = translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                ? "dark-confirm react-confirm-alert-body"
                : "react-confirm-alert-body"
            }
          >
            <h1>{delete_item}</h1>
            <p>{do_u_really_want_delete_item}</p>
            <div className="react-confirm-alert-button-group">
              <button
                onClick={() => {
                  this.deleteClickTrack(deletekey);
                  onClose();
                }}
              >
                {yes}
              </button>
              <button
                onClick={() => {
                  onClose();
                }}
              >
                {no}
              </button>
            </div>
          </div>
        );
      },
    });
  };
  //Open patient data
  handleOpenData = () => {
    this.setState({ openData: true });
  };
  handleCloseData = () => {
    this.setState({ openData: false, error_msg: false });
  };

  //Delete the track
  deleteClickTrack = async (deletekey) => {
    var user_id = this.props.Doctorsetget.p_id;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    let response = await delete_click_track(user_token, user_id, deletekey)
    if (response) {
      this.setState({ loaderImage: false });
      this.getTrack();
      this.rightInfo();
    }
  };
  //Update Archive Track State
  updateArchiveTrack = (data) => {
    data.archive = true;
    var user_id = this.props.Doctorsetget.p_id;
    var user_token = this.props.stateLoginValueAim.token;
    var track_id = data.track_id;
    this.setState({ loaderImage: true });
    axios
      .put(
        sitedata.data.path + "/User/AddTrack/" + user_id + "/" + track_id,
        { data },
        commonHeader(user_token)
      )
      .then((response) => {
        this.setState({
          ismore_five: false,
          updateTrack: {},
          updateOne: "",
          isfileupload: false,
          isfileuploadmulti: false,
          loaderImage: false,
        });
        this.getTrack();
      });
  };
  //Select type for the new Entry
  SelectOption = (value) => {
    this.setState({ current_select: value }, () => {
      this.handleaddInqryNw();
    });
  };

  //For open Edit
  EidtOption = (value, updateTrack, visibility) => {
    this.setState(
      {
        visibility: visibility,
        current_select: value,
        updateTrack: updateTrack,
      },
      () => {
        this.handleaddInqryNw();
      }
    );
  };

  // Open Personalized Datas
  handleOpenDash = () => {
    this.setState({ openDash: true });
  };
  // Close Personalized Data
  handleCloseDash = () => {
    this.setState({ openDash: false });
  };

  //Open for the Add entry
  handleOpenEntry = () => {
    this.setState({ openEntry: true, updateOne: 0 });
  };
  //Close for the Add entry
  handleCloseEntry = () => {
    this.setState({ openEntry: false });
  };

  //Open ADD/EDIT popup
  handleaddInqryNw = () => {
    this.setState({ addInqryNw: true });
  };
  //Close ADD/EDIT popup
  handleCloseInqryNw = () => {
    this.setState({ addInqryNw: false, visibility: false });
  };

  // handleaddInqrySw = () => {
  //     this.setState({ addInqrySw: true });
  // };
  // handleCloseInqrySw = () => {
  //     this.setState({ addInqrySw: false });
  // };
  componentDidMount() {
    var npmCountry = npmCountryList().getData();
    this.setState({ selectCountry: npmCountry });
    this.getMetadata();
    if (this.props.Doctorsetget && this.props.Doctorsetget.p_id) {
      this.GetInfoForPatient();
    }
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.stateLanguageType !== this.props.stateLanguageType) {
      this.GetLanguageMetadata();
    }
  };

  //Upload file MultiFiles
  FileAttachMulti = (event) => {
    // this.setState({file:})
    this.setState({ isfileuploadmulti: true });
    var user_id = this.props.Doctorsetget.p_id;
    var user_token = this.props.stateLoginValueAim.token;
    const data = new FormData();
    if (event[0].type === "application/x-zip-compressed") {
      this.setState({ file_type: true, isless_one: false, isless_one: false });
    } else {
      if (event.length < 1) {
        this.setState({
          isless_one: true,
          ismore_five: false,
          file_type: false,
        });
      }
      if (event.length > 5) {
        this.setState({
          ismore_five: true,
          isless_one: false,
          file_type: false,
        });
      } else {
        var Fileadd = [];
        this.setState({
          ismore_five: false,
          isless_one: false,
          file_type: false,
        });
        for (var i = 0; i < event.length; i++) {
          let file = event[i];
          let fileParts = file.name.split(".");
          let fileName = fileParts[0];
          let fileType = fileParts[1];
          axios
            .post(sitedata.data.path + "/aws/sign_s3", {
              fileName: fileName,
              fileType: fileType,
              folders:
                this.props.stateLoginValueAim.user.profile_id + "/Trackrecord/",
              bucket: this.props.stateLoginValueAim.user.bucket,
            })
            .then((response) => {
              Fileadd.push({
                filename:
                  response.data.data.returnData.url +
                  "&bucket=" +
                  this.props.stateLoginValueAim.user.bucket,
                filetype: fileType,
              });
              setTimeout(() => {
                this.setState({ fileupods: false });
              }, 3000);
              let returnData = response.data.data.returnData;
              let signedRequest = returnData.signedRequest;
              let url = returnData.url;
              if (fileType === "pdf") {
                fileType = "application/pdf";
              }
              // Put the fileType in the headers for the upload
              var options = {
                headers: {
                  "Content-Type": fileType,
                },
              };
              axios
                .put(signedRequest, file, options)
                .then((result) => { })
                .catch((error) => { });
            })
            .catch((error) => { });
          this.setState({
            fileattach: Fileadd,
            loaderImage: false,
            fileupods: true,
          });
        }
      }
    }
    setTimeout(
      function () {
        this.setState({
          file_type: false,
          isless_one: false,
          ismore_five: false,
        });
      }.bind(this),
      2000
    );
  };

  //For getting full data of hide Show
  GetHideShow = (data) => {
    const state = this.state.updateTrack;
    Object.entries(data).map(([k, v]) => {
      if (k === "publicdatetime") {
        if (v !== null) {
          state["public"] = moment(v).utc();
        }
      }
      state[k] = v;
    });
    this.setState({ updateTrack: state });
  };

  //For update the Track state
  updateEntryState1 = (value, name) => {
    const state = this.state.updateTrack;
    state[name] = value;
    this.setState({ updateTrack: state });
  };

  //For update the Track state
  updateEntryState = (e) => {
    const state = this.state.updateTrack;
    state[e.target.name] = e.target.value;
    this.setState({ updateTrack: state });
  };

  //For adding the Track entry
  AddTrack = () => {
    this.setState({ loaderImage: true });
    var data = this.state.updateTrack;
    var user_id = this.props.Doctorsetget.p_id;
    var user_token = this.props.stateLoginValueAim.token;
    if (this.state.isfileupload) {
      data.attachfile = this.state.fileattach;
    } else if (this.state.isfileuploadmulti) {
      data.attachfile = this.state.fileattach;
    }
    data.type = this.state.current_select;
    data.created_on = new Date();
    data.datetime_on = new Date();
    if (
      this.state.current_select === "blood_pressure" ||
      this.state.current_select === "weight_bmi" ||
      this.state.current_select === "blood_sugar" ||
      this.state.current_select === "marcumar_pass" ||
      this.state.current_select === "laboratory_result"
    ) {
      if (data.date_measured && data.date_measured !== "") {
        data.datetime_on = new Date(data.date_measured);
      }
    } else if (this.state.current_select === "diagnosis") {
      if (data.diagnosed_on && data.diagnosed_on !== "") {
        data.datetime_on = new Date(data.diagnosed_on);
      }
    } else if (this.state.current_select === "doctor_visit") {
      if (data.date_doctor_visit && data.date_doctor_visits !== "") {
        data.datetime_on = new Date(data.date_doctor_visit);
      }
    } else if (this.state.current_select === "hospitalization") {
      if (data.first_visit_date && data.first_visit_date !== "") {
        data.datetime_on = new Date(data.first_visit_date);
      }
    } else if (this.state.current_select === "vaccination") {
      if (data.data_of_vaccination && data.data_of_vaccination !== "") {
        data.datetime_on = new Date(data.data_of_vaccination);
      }
    } else {
      if (data.event_date && data.event_date !== "") {
        data.datetime_on = new Date(data.event_date);
      } else {
        data.event_date = new Date();
      }
    }
    var track_id = this.state.updateTrack.track_id;
    if (
      this.state.updateTrack &&
      this.state.updateTrack.track_id &&
      this.state.updateTrack.track_id !== "" &&
      this.state.updateTrack.track_id !== "undefined"
    ) {
      data.updated_by = this.props.stateLoginValueAim.user._id;
      axios
        .put(
          sitedata.data.path + "/User/AddTrack/" + user_id + "/" + track_id,
          { data },
          commonHeader(user_token)
        )
        .then((response) => {
          this.setState({
            ismore_five: false,
            isless_one: false,
            updateTrack: {},
            updateOne: "",
            visibleupdate: 0,
            isfileupload: false,
            isfileuploadmulti: false,
            loaderImage: false,
          });
          this.getTrack();
          this.handleCloseInqryNw();
        });
    } else {
      data.created_by = this.props.stateLoginValueAim.user._id;
      axios
        .put(
          sitedata.data.path + "/User/AddTrack/" + user_id,
          { data },
          commonHeader(user_token)
        )
        .then((response) => {
          this.setState({
            updateTrack: {},
            isfileupload: false,
            isfileuploadmulti: false,
            fileattach: {},
            current_select: "diagnosis",
            Addmore: true,
            newElement: false,
            loaderImage: false,
            ismore_five: false,
            isless_one: false,
          });
          this.getTrack();
          this.handleCloseInqryNw();
        });
    }
    this.setState({ updateTrack: {} });
  };

  //For get the Track
  getTrack = () => {
    var user_id = this.props.Doctorsetget.p_id;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    axios
      .get(
        sitedata.data.path +
        "/emergency_record/pharmacyPrescription/" +
        user_id,
        commonHeader(user_token)
      )
      .then((response) => {
        if (response.data.hassuccessed === true) {
          //This is for Aimedis Blockchain Section
          this.rightInfo();
          var images = [];
          response.data.data.track_record = response.data?.data?.track_record.filter((e) => e != null);

          this.rightInfo();
          this.setState({
            allTrack1: response.data?.data?.track_record,
            allTrack2: response.data?.data?.track_record,
            loaderImage: false,
            defaultValue: 20,
          },
            () => { this.Showdefaults(this.state.allTrack2, this.state.defaultValue) });
        } else {
          this.setState({ allTrack1: [], allTrack: [], allTrack2: [], loaderImage: false });
        }
      })
      .catch((error) => {
        this.setState({ loaderImage: false });
      });
  };

  //Get All information Related to Metadata
  getMetadata() {
    this.setState({ allMetadata: this.props.metadata }, () => {
      this.GetLanguageMetadata();
    });
    // var user_token = this.props.stateLoginValueAim.token;
    // axios
    //   .get(sitedata.data.path + "/UserProfile/Metadata", {
    //     headers: {
    //       token: user_token,
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     this.setState({ allMetadata: response.data[0] });
    //     this.GetLanguageMetadata();
    //   });
  }

  GetLanguageMetadata = () => {
    if (this.state.allMetadata) {
      var AllATC_code =
        this.state.allMetadata &&
        this.state.allMetadata.ATC_code &&
        this.state.allMetadata.ATC_code;

      var Alltemprature =
        this.state.allMetadata &&
        this.state.allMetadata.Temprature &&
        this.state.allMetadata.Temprature;
      var Allgender = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.gender &&
        this.state.allMetadata.gender,
        this.props.stateLanguageType
      );
      var Allpain_type = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.pain_type &&
        this.state.allMetadata.pain_type,
        this.props.stateLanguageType
      );
      var Pressuresituation = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.situation_pressure &&
        this.state.allMetadata.situation_pressure,
        this.props.stateLanguageType
      );
      var Allpain_quality = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.pain_quality &&
        this.state.allMetadata.pain_quality &&
        this.state.allMetadata.pain_quality,
        this.props.stateLanguageType
      );
      var Allsituation = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.situation &&
        this.state.allMetadata.situation,
        this.props.stateLanguageType
      );
      var Allsmoking_status = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.smoking_status &&
        this.state.allMetadata.smoking_status,
        this.props.stateLanguageType
      );

      var Allreminder = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.reminder &&
        this.state.allMetadata.reminder,
        this.props.stateLanguageType
      );
      var Allrelation = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.relation &&
        this.state.allMetadata.relation,
        this.props.stateLanguageType
      );
      var Allsubstance = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.substance &&
        this.state.allMetadata.substance,
        this.props.stateLanguageType
      );
      var Anamnesis = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.anamnesis &&
        this.state.allMetadata.anamnesis,
        this.props.stateLanguageType
      );
      var personalised_card = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.personalised_card &&
        this.state.allMetadata.personalised_card,
        this.props.stateLanguageType,
        "personalised_card"
      );
      var Alltime_taken =
        this.state.allMetadata &&
        this.state.allMetadata.time_taken &&
        this.state.allMetadata.time_taken;
      if (Alltime_taken && Alltime_taken.length > 0) {
        Alltime_taken.sort(mySorter);
      }

      this.setState({
        Alltemprature: Alltemprature,
        Anamnesis: Anamnesis,
        AllATC_code: AllATC_code,
        Allpain_type: Allpain_type,
        Allpain_quality: Allpain_quality,
        Pressuresituation: Pressuresituation,
        Allsituation: Allsituation,
        Allsmoking_status: Allsmoking_status,
        Allreminder: Allreminder,
        AllSpecialty: GetLanguageDropdown(
          SPECIALITY.speciality.english,
          this.props.stateLanguageType
        ),
        Allsubstance1: Allsubstance,
        Allrelation: Allrelation,
        Allgender: Allgender,
        Alltime_taken: Alltime_taken,
        personalised_card: personalised_card,
        // AllL_P: AllL_Ps.AllL_Ps,
      });
    }
  };

  //Get the RIGHT INFO
  rightInfo() {
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(
        sitedata.data.path +
        "/rightinfo/patient/" +
        this.props.Doctorsetget.p_id,
        commonHeader(user_token)
      )
      .then((response) => {
        this.setState({ personalinfo: response.data.data });
      });
  }

  //Get the Current User Profile
  cur_one2 = async () => {
    var user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.Doctorsetget.p_id;
    let response = await get_cur_one(user_token, user_id)
    this.setState({ cur_one2: response.data.data });
  };

  //Get the Current User Profile
  cur_one = async () => {
    var user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.stateLoginValueAim.user._id;
    let response = await get_cur_one(user_token, user_id)
    this.setState({ cur_one: response.data.data });
  };
  //To access the data of another Patient
  AnotherPatient = () => {
    var user_id = null;
    var pin = null;
    this.props.Doctorset(user_id, pin);
  };
  //Move to Profile page
  MoveProfile = () => {
    this.props.history.push("/patient/");
  };
  //Move to Appointment Page
  MoveAppoint = () => {
    this.props.history.push("/patient/appointment");
  };
  //For the GetTrack for the patient
  setTrack = () => {
    var user_id = this.state.gettrackdatas.patient_id;
    var pin = this.state.gettrackdatas.pin;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    if (user_id === "") {
      this.setState({ error_msg: true, loaderImage: false });
    } else {
      axios
        .get(
          sitedata.data.path +
          "/User/getUser/" +
          user_id +
          "?pin=" +
          pin +
          "&&comefrom=healthdata",
          commonHeader(user_token)
        )
        .then((response) => {
          if (response.data.hassuccessed === true) {
            this.setState({});
            this.props.Doctorset(response.data.user_id, pin);
            this.GetInfoForPatient();
          } else {
            this.setState({ error_msg: true, loaderImage: false });
          }
        });
    }
    setTimeout(() => {
      this.setState({ error_msg: false });
    }, 5000);
  };
  //Get the All information of the Patient
  GetInfoForPatient = () => {
    this.getGender();
    this.cur_one();
    this.cur_one2();
    this.rightInfo();
    this.getTrack();
    this.getPesonalized();
    this.handleCloseData();
  };

  //For getting the existing settings
  getPesonalized = async () => {
    this.setState({ loaderImage: true });
    var user_id = this.props.Doctorsetget.p_id;
    let user_token = this.props.stateLoginValueAim.token
    let responce = await get_personalized(user_token, user_id)
    // axios
    //   .get(sitedata.data.path + "/UserProfile/updateSetting/" + user_id, {
    //     headers: {
    //       token: this.props.stateLoginValueAim.token,
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((responce) => {
    if (
      responce.data.hassuccessed &&
      responce.data.data &&
      responce.data.data.personalized &&
      responce.data.data.personalized.length > 0
    ) {
      this.setState({ added_data: responce.data.data.personalized });
    } else {
      this.setState({ added_data: [] });
    }
    this.setState({ loaderImage: false });
    // });
  };

  //for get the track data on the bases of pateint
  GetTrackData = (e) => {
    const state = this.state.gettrackdatas;
    state[e.target.name] = e.target.value;
    this.setState({ gettrackdatas: state });
  };
  //Move to Document Page
  MoveDocument = () => {
    this.props.history.push("/patient/documents");
  };
  //For getting the information of the Patient Gender
  getGender = async () => {
    const { stateLoginValueAim, Doctorsetget } = this.props
    let response = await get_gender(stateLoginValueAim.token, Doctorsetget.p_id)
    this.setState({ patient_gender: response })
  }

  //This is for the Download the Track
  //This is for the Download the Track
  downloadTrack = async (data) => {
    this.setState({ loaderImage: true });
    let response = await download_track(data, this.props.stateLoginValueAim)
    setTimeout(() => {
      this.setState({ loaderImage: false });
    }, 5000)
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      journal,
      secnd_openion,
      sick_cert,
      prescription,
      anamnesis,
      patient_data_access,
      id_pin_not_correct,
      patient_id,
      pin,
      another_patient_data,
      healthcare_access_for_non_conn_patient,
      patient_access_data,
      add_new_entry,
      get_patient_access_data,
      New,
      entry,
      edit,
      blood_pressure,
      doc_visit,
      blood_sugar,
      covid_diary,
      condition_pain,
      loadingref,
      diagnosis,
      diary,
      weight_bmi,
      vaccination,
      marcumar_pass,
      smoking_status,
      hosp_visit,
      view_data,
      lab_result,
      file_uplod,
      family_anmnies,
      medication,
      enter_pin,
      enter_patient_id,
      Seemore10entries,
      personalize_dashbrd,
    } = translate;

    const { stateLoginValueAim, Doctorsetget } = this.props;
    if (
      stateLoginValueAim.user === "undefined" ||
      stateLoginValueAim.token === 450 ||
      stateLoginValueAim.token === "undefined" ||
      stateLoginValueAim.user.type !== "pharmacy" ||
      !this.props.verifyCode ||
      !this.props.verifyCode.code
    ) {
      return <Redirect to={"/"} />;
    }
    return (
      <Grid
        className={
          this.props.settings &&
            this.props.settings.setting &&
            this.props.settings.setting.mode &&
            this.props.settings.setting.mode === "dark"
            ? "homeBg homeBgDrk"
            : "homeBg"
        }
      >
        {this.state.loaderImage && <Loader />}
        <Grid className="homeBgIner">
          <Grid container direction="row" justify="center">
            <Grid item xs={12} md={12}>
              {!this.state.isGraph && (
                <Grid container direction="row">
                  {/* Website Menu */}
                  <LeftMenu isNotShow={true} currentPage="pharmajournal" />
                  <LeftMenuMobile
                    isNotShow={true}
                    currentPage="pharmajournal"
                  />
                  {/* <Notification /> */}
                  {/* End of Website Menu */}

                  {/* Website Mid Content */}
                  <Grid item xs={12} md={8}>
                    {/* Start of Depression Section */}
                    <Grid className="descpCntntMain">
                      <Grid className="journalAdd">
                        <Grid container direction="row">
                          <Grid item xs={11} md={11}>
                            <Grid container direction="row">
                              <Grid item xs={6} md={6}>
                                <h1>{patient_access_data}</h1>
                              </Grid>
                              <Grid item xs={6} md={6}>
                                <Grid className="AddEntrynw">
                                  {this.props.Doctorsetget &&
                                    this.props.Doctorsetget.p_id !== null ? (
                                    <a onClick={this.AnotherPatient}>
                                      {another_patient_data}
                                    </a>
                                  ) : (
                                    <a onClick={this.handleOpenData}>
                                      {get_patient_access_data}
                                    </a>
                                  )}
                                  {/* {this.props.Doctorsetget && this.props.Doctorsetget.p_id !== null && <a onClick={this.handleOpenEntry}>+ {add_new_entry}</a>} */}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* For the filter section */}
                      {/* {this.props.Doctorsetget.p_id !== null && <FilterSec FilterText={this.FilterText} settings={this.props.settings} FilterData={this.FilterData} SortData={this.SortData} ClearData={this.ClearData} sortBy={this.state.Sort}/>} */}

                      {/* For Empty Entry */}

                      {this.props.Doctorsetget.p_id !== null && (
                        <div>
                          {this.state.allTrack &&
                            this.state.allTrack.length > 0 ? (
                            <div>
                              {this.state.allTrack.map((item, index) => (
                                <ViewTimeline
                                  lrp={AllL_Ps.AllL_Ps.english}
                                  Allrelation={this.state.Allrelation}
                                  Allreminder={this.state.Allreminder}
                                  Allpain_type={this.state.Allpain_type}
                                  Allsmoking_status={this.state.Allsmoking_status}
                                  Allgender={this.state.Allgender}
                                  AllSpecialty={this.state.AllSpecialty}
                                  Allpain_quality={this.state.Allpain_quality}
                                  Allsituation={this.state.Allsituation}
                                  Pressuresituation={this.state.Pressuresituation}
                                  Anamnesis={this.state.Anamnesis}
                                  downloadTrack={(data) =>
                                    this.downloadTrack(data)
                                  }
                                  OpenGraph={this.OpenGraph}
                                  comesfrom="pharmacy"
                                  images={this.state.images}
                                  DeleteTrack={(deleteKey) =>
                                    this.DeleteTrack(deleteKey)
                                  }
                                  ArchiveTrack={(data) => this.ArchiveTrack(data)}
                                  EidtOption={(value, updateTrack, visibility) =>
                                    this.EidtOption(
                                      value,
                                      updateTrack,
                                      visibility
                                    )
                                  }
                                  date_format={
                                    this.props.settings &&
                                    this.props.settings.setting &&
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings &&
                                    this.props.settings.setting &&
                                    this.props.settings.setting.time_format
                                  }
                                  Track={item}
                                  loggedinUser={this.state.cur_one}
                                  patient_gender={this.state.patient_gender}
                                />
                              ))}
                              {this.state.allTrack2 > this.state.allTrack && <div className="more10entries" onClick={() => this.LoadMore(this.state.allTrack2)}>
                                {Seemore10entries}
                              </div>}
                              {this.state.loading && <div className="more10entries">
                                {loadingref}
                              </div>}
                            </div>
                          ) : (
                            <EmptyData />
                          )}
                        </div>
                      )}
                      {/* <ViewTimeline date_format={this.props.settings.setting.date_format}  time_format={this.props.settings.setting.time_format} allTrack={this.state.allTrack} from="patient" loggedinUser={this.state.cur_one} patient_gender={this.state.patient_gender} /> */}
                    </Grid>
                  </Grid>
                  {/* End of Website Mid Content */}

                  {/* Model Patient Data Access */}
                  <Modal
                    open={this.state.openData}
                    onClose={this.handleCloseData}
                    className={
                      this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode === "dark"
                        ? "darkTheme"
                        : ""
                    }
                  >
                    <Grid className="dataBoxCntnt">
                      <Grid className="dataCourse">
                      <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={8}>
                          <label>{patient_data_access}</label>
                          <p>{healthcare_access_for_non_conn_patient}</p>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4}>
                            <Grid>
                            <Grid className="entryCloseBtn">
                                <a onClick={this.handleCloseData}>
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
                      <Grid className="dataBoxUpr">
                      <Grid>
                          {this.state.error_msg && (
                            <div className="err_message">
                              {id_pin_not_correct}
                            </div>
                          )}
                        </Grid>
                        <Grid className="dataBoxInput">
                          <Grid>
                            <Grid>
                              <label>{patient_id}</label>
                            </Grid>
                            <Grid>
                              <input
                                type="text"
                                name="patient_id"
                                placeholder={enter_patient_id}
                                id="login-name"
                                onChange={this.GetTrackData}
                              />
                            </Grid>
                          </Grid>
                          <Grid>
                            <Grid>
                              <label>{pin}</label>
                            </Grid>
                            <Grid>
                              <input
                                type="text"
                                id="pin"
                                name="pin"
                                placeholder={enter_pin}
                                onChange={this.GetTrackData}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid className="dataBoxSub">
                          <input
                            type="submit"
                            value={view_data}
                            onClick={this.setTrack}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Modal>
                  {/* End of Model Patient Data Access */}

                  {/* Website Right Content */}
                  {this.props.Doctorsetget.p_id !== null && (
                    <Grid item xs={12} md={3} className="rghtSideSpc">
                      <ProfileSection
                        settings={this.props.settings}
                        personalinfo={this.state.personalinfo}
                        user={this.state.cur_one2}
                        user_token={this.props.stateLoginValueAim.token}
                        getData={this.cur_one2}
                      />
                      {/* Model setup */}
                      <Modal
                        open={this.state.addInqryNw}
                        onClose={this.handleCloseInqryNw}
                        className={
                          this.props.settings &&
                            this.props.settings.setting &&
                            this.props.settings.setting.mode === "dark"
                            ? "darkTheme nwDiaModel"
                            : "nwDiaModel"
                        }
                      >
                        <Grid className="nwDiaCntnt">
                          <Grid className="nwDiaCntntIner">
                            <Grid className="nwDiaCourse">
                            <Grid container direction="row" justify="center">
                              <Grid item xs={8} md={8} lg={8}>
                              {this.state.updateOne !==
                                this.state.updateTrack._id ? (
                                <div>
                                  <p>
                                    {New} {entry}
                                  </p>
                                  <Grid className="nwDiaSel1">
                                      {this.state.current_select}
                                      </Grid>
                                </div>
                              ) : (
                                <div>
                                  <p>
                                    {edit} {entry}
                                  </p>
                                  <Grid className="nwDiaSel">
                                    <select
                                      disabled
                                      onChange={(e) =>
                                        this.SelectOption(e.target.value)
                                      }
                                      value={this.state.current_select}
                                    >
                                      <option value="anamnesis">
                                        {anamnesis}
                                      </option>
                                      <option value="blood_pressure">
                                        {blood_pressure}
                                      </option>
                                      <option value="blood_sugar">
                                        {blood_sugar}
                                      </option>
                                      <option value="condition_pain">
                                        {condition_pain}
                                      </option>
                                      <option value="covid_19">
                                        {covid_diary}
                                      </option>
                                      <option value="diagnosis">
                                        {diagnosis}
                                      </option>
                                      <option value="diary">{diary}</option>
                                      <option value="doctor_visit">
                                        {doc_visit}
                                      </option>
                                      <option value="family_anamnesis">
                                        {family_anmnies}
                                      </option>
                                      <option value="file_upload">
                                        {file_uplod}
                                      </option>
                                      <option value="hospitalization">
                                        {hosp_visit}
                                      </option>
                                      <option value="laboratory_result">
                                        {lab_result}
                                      </option>
                                      <option value="marcumar_pass">
                                        {marcumar_pass}
                                      </option>
                                      <option value="medication">
                                        {medication}
                                      </option>
                                      <option value="prescription">
                                        {prescription}
                                      </option>
                                      <option value="second_opinion">
                                        {secnd_openion}
                                      </option>
                                      <option value="sick_certificate">
                                        {sick_cert}
                                      </option>
                                      <option value="smoking_status">
                                        {smoking_status}
                                      </option>
                                      <option value="vaccination">
                                        {vaccination}
                                      </option>
                                      <option value="weight_bmi">
                                        {weight_bmi}
                                      </option>
                                    </select>
                                  </Grid>
                                </div>
                              )}
                              </Grid>
                              <Grid item xs={4} md={4} lg={4}>
                                  <Grid>
                                  <Grid className="entryCloseBtn">
                                      <a onClick={this.handleCloseInqryNw}>
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
                            <Grid>
                              {this.state.current_select === "anamnesis" && (
                                <AnamnesisFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  gender={this.state.patient_gender}
                                  options={this.state.Anamnesis}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select ===
                                "blood_pressure" && (
                                  <BPFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    options={this.state.Pressuresituation}
                                    AddTrack={this.AddTrack}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select === "blood_sugar" && (
                                <BSFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  options={this.state.Allsituation}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select ===
                                "condition_pain" && (
                                  <CPFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    gender={this.state.patient_gender}
                                    GetHideShow={this.GetHideShow}
                                    options={this.state.Allpain_quality}
                                    options2={this.state.Allpain_type}
                                    AddTrack={this.AddTrack}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select === "covid_19" && (
                                <CovidFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  gender={this.state.patient_gender}
                                  GetHideShow={this.GetHideShow}
                                  options={this.state.selectCountry}
                                  options2={this.state.Alltemprature}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select === "diagnosis" && (
                                <DiagnosisFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  gender={this.state.patient_gender}
                                  GetHideShow={this.GetHideShow}
                                  options={this.state.selectCountry}
                                  options2={this.state.Alltemprature}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select === "diary" && (
                                <DiaryFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select === "doctor_visit" && (
                                <DVFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  AddTrack={this.AddTrack}
                                  options={this.state.AllSpecialty}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select ===
                                "family_anamnesis" && (
                                  <FAFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    AddTrack={this.AddTrack}
                                    options={this.state.Allgender}
                                    relativeList={this.state.Allrelation}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select === "file_upload" && (
                                <FUFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  AddTrack={this.AddTrack}
                                  options={this.state.AllSpecialty}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select ===
                                "hospitalization" && (
                                  <HVFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    AddTrack={this.AddTrack}
                                    options={this.state.AllSpecialty}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select ===
                                "laboratory_result" && (
                                  <LRFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    lrpUnit={AllL_Ps.AllL_Ps.units}
                                    lrpEnglish={AllL_Ps.AllL_Ps.english}
                                    GetHideShow={this.GetHideShow}
                                    AddTrack={this.AddTrack}
                                    options={this.state.AllSpecialty}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select ===
                                "marcumar_pass" && (
                                  <MPFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    AddTrack={this.AddTrack}
                                    date_format={
                                      this.props.settings.setting.date_formats
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select === "medication" && (
                                <MedicationFields
                                  lrpUnit={AllL_Ps.AllL_Ps.units}
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  options={this.state.AllATC_code}
                                  reminders={this.state.Allreminder}
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select === "prescription" && (
                                <PFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  options={this.state.Pressuresituation}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select ===
                                "second_opinion" && (
                                  <SOFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    options={this.state.Pressuresituation}
                                    AddTrack={this.AddTrack}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select ===
                                "sick_certificate" && (
                                  <SCFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    options={this.state.Pressuresituation}
                                    AddTrack={this.AddTrack}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select ===
                                "smoking_status" && (
                                  <SSFields
                                    FileAttachMulti={this.FileAttachMulti}
                                    visibility={this.state.visibility}
                                    comesfrom="pharmacy"
                                    GetHideShow={this.GetHideShow}
                                    options={this.state.Allsmoking_status}
                                    AddTrack={this.AddTrack}
                                    date_format={
                                      this.props.settings.setting.date_format
                                    }
                                    time_format={
                                      this.props.settings.setting.time_format
                                    }
                                    updateEntryState={this.updateEntryState}
                                    updateEntryState1={this.updateEntryState1}
                                    updateTrack={this.state.updateTrack}
                                  />
                                )}
                              {this.state.current_select === "vaccination" && (
                                <VaccinationFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                              {this.state.current_select === "weight_bmi" && (
                                <BMIFields
                                  FileAttachMulti={this.FileAttachMulti}
                                  visibility={this.state.visibility}
                                  comesfrom="pharmacy"
                                  GetHideShow={this.GetHideShow}
                                  AddTrack={this.AddTrack}
                                  date_format={
                                    this.props.settings.setting.date_format
                                  }
                                  time_format={
                                    this.props.settings.setting.time_format
                                  }
                                  updateEntryState={this.updateEntryState}
                                  updateEntryState1={this.updateEntryState1}
                                  updateTrack={this.state.updateTrack}
                                />
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Modal>
                      {/* End of Model setup */}

                      {/* Model setup */}
                      {/* <AddEntry settings={this.props.settings} new_entry={this.props.new_entry} openBy="pharmacy" openEntry={this.state.openEntry} value="diagnosis" onChange={this.SelectOption} handleCloseEntry={this.handleCloseEntry} /> */}
                      {/* End of Model setup */}

                      {/* <RightManage added_data={this.state.added_data} MoveDocument={this.MoveDocument} MoveAppoint={this.MoveAppoint} SelectOption={this.SelectOption} personalinfo={{}} /> */}
                      {/* <RightManage upcoming_appointment={this.state.upcoming_appointment} OpenGraph={this.OpenGraph} date_format={this.props.settings.setting.date_format}  time_format={this.props.settings.setting.time_format} from="patient"  added_data={this.state.added_data} MoveDocument={this.MoveDocument} MoveAppoint={this.MoveAppoint} SelectOption={this.SelectOption} personalinfo={this.state.personalinfo} /> */}
                    </Grid>
                  )}
                  {/* End of Website Right Content */}
                </Grid>
              )}
              {/* {this.state.isGraph && 
                             <GraphView date_format={this.props.settings.setting.date_format}  time_format={this.props.settings.setting.time_format} personalinfo={this.state.personalinfo} current_Graph = {this.state.current_Graph} CloseGraph={this.CloseGraph} />
                            } */}
            </Grid>
          </Grid>
          <FloatArrowUp stateLanguageType={this.props.stateLanguageType} />
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
  } = state.LoginReducerAim;
  const { stateLanguageType } = state.LanguageReducer;
  const { settings } = state.Settings;
  const { Doctorsetget } = state.Doctorset;
  const { verifyCode } = state.authy;
  const { metadata } = state.OptionList;
  // const { catfil } = state.filterate;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    Doctorsetget,
    verifyCode,
    metadata,
    //   catfil
  };
};
export default withRouter(
  connect(mapStateToProps, {
    Doctorset,
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    authy,
    OptionList
  })(Index)
);
