import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import sitedata from "sitedata";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { LanguageFetchReducer } from "Screens/actions";
import AddEntry from "Screens/Components/AddEntry/index";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction";
import FilterSec from "Screens/Components/TimelineComponent/Filter/index";
import {
  SortByEntry,
  SortByDiagnose,
  mySorter,
  getReminder,
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
import RespirationField from "Screens/Components/TimelineComponent/RespirationField/index";
import PromotionFields from "Screens/Components/TimelineComponent/PromotionFields/index";
import AllL_Ps from "Screens/Components/Parameters/parameter.js";
import LRFields from "Screens/Components/TimelineComponent/LRFields/index";
import CovidSymptomsField from "Screens/Components/TimelineComponent/CovidSymptomsField/index";
import FUFields from "Screens/Components/TimelineComponent/FUFields/index";
import FAFields from "Screens/Components/TimelineComponent/FAFields/index";
import npmCountryList from "react-select-country-list";
import CovidFields from "Screens/Components/TimelineComponent/CovidFields/index";
import EmptyData from "Screens/Components/TimelineComponent/EmptyData";
import DiagnosisFields from "Screens/Components/TimelineComponent/DiagnosisFields/index";
import VaccinationTrialFields from "Screens/Components/TimelineComponent/VaccinationTrialFields/index.js";
import FloatArrowUp from "Screens/Components/FloatArrowUp/index";
import moment from "moment";
import { authy } from "Screens/Login/authy.js";
import { OptionList } from "Screens/Login/metadataaction";
import { getLanguage } from "translations/index";
import PFields from "Screens/Components/TimelineComponent/PFields/index.js";
import AnamnesisFields from "Screens/Components/TimelineComponent/AnamnesisFields/index.js";
import SCFields from "Screens/Components/TimelineComponent/SCFields/index.js";
import SOFields from "Screens/Components/TimelineComponent/SOFields/index.js";
import DownloadFullTrack from "Screens/Components/DownloadFullTrack/index";
import VideoDemo from "Screens/Components/VideoDemo/index";
import { commonHeader } from "component/CommonHeader/index"
import SPECIALITY from "speciality";
import { GetLanguageDropdown } from "Screens/Components/GetMetaData/index.js";
import { get_gender, get_cur_one, get_personalized, get_track, update_entry_state, delete_click_track, download_track } from "Screens/Components/CommonApi/index";
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
      medication_unit: [],
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
      upcoming_appointment: [],
      SARS: [],
      itive_SARS: [],
      vaccinations: [],
      defaultValue: 20,
      loading: false,
      PatientList: [],
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

  //For clear the filter
  ClearData = () => {
    this.setState(
      { Sort: "diagnosed_time", allTrack2: this.state.allTrack1, allTrack: this.state.allTrack1, defaultValue: 20 },
      () => {
        this.SortData()
        this.Showdefaults(this.state.allTrack2, this.state.defaultValue)
      }
    );
  };

  isThisAvilabel = (object, text) => {
    if (object && typeof object === "object") {
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
      return [];
    }
  };

  //Filter according to the type
  FilerFromType = (Datas, type) => {
    var Datas1 = [];
    if (Datas && Datas.length > 0) {
      if (type && type.length > 0) {
        type.map((ob) => {
          var dts = Datas.filter((obj) => obj.type === ob.value);
          Datas1 = Datas1.concat(dts);
        });
        return Datas1;
      } else {
        return null;
      }
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
    let { delete_item, do_u_really_want_delete_item, yes, no } = translate;
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
    this.setState({ openData: false });
  };

  //Delete the track
  deleteClickTrack = async (deletekey) => {
    var user_id = this.props.match.params.id;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    let response = await delete_click_track(user_token, user_id, deletekey)
    if (response) {
      this.setState({ loaderImage: false });
      this.getTrack();
      this.props.rightInfo();
    }
  };
  //Update Archive Track State
  updateArchiveTrack = (data) => {
    data.archive = true;
    var user_id = this.props.match.params.id;
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
          updateOne: 0,
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
        updateOne: updateTrack.track_id,
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
    this.setState({ openEntry: true, updateOne: 0, updateTrack: {} });
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
    this.getPatientList();
    if (this.props.match.params.id) {
      this.GetInfoForPatient();
    }
    if (this.props.history.location?.state?.data && this.props.history.location?.state?.data === true) {
      this.setState({ openEntry: true });
    }
  }

  getPatientList = () => {
    var institute_id = this.props.stateLoginValueAim?.user?.institute_id?.length > 0 ? this.props.stateLoginValueAim?.user?.institute_id[0] : ''
    axios.get(`${sitedata.data.path}/User/PatientListPromotion/${this.props.House?.value}/${institute_id}`,
      {
        headers: {
          'token': this.props.stateLoginValueAim.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.data.hassuccessed) {
          var patientList = response.data.data && response.data.data.length > 0 && response.data.data.map((item, index) => {
            if (item.patient_id) {
              var name = item?.patient?.first_name && item?.patient?.last_name ? item?.patient?.first_name + ' ' + item?.patient?.last_name : item?.patient?.first_name;
              return {
                value: item.patient_id,
                label: name
              }
            }
            else {
              let name = item.first_name && item.last_name ? item.first_name + ' ' + item.last_name : item.first_name;
              return { label: name, value: item._id }
            }

          })
          this.setState({ PatientList: patientList })
        }
      })
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.stateLanguageType !== this.props.stateLanguageType) {
      this.GetLanguageMetadata();
    }
  };

  FileAttachMulti = (Fileadd) => {
    this.setState({
      isfileuploadmulti: true,
      fileattach: Fileadd,
      fileupods: true,
    });
  };

  FileAttachMultiVaccination = (Fileadd, name) => {
    if (name === "SARS") {
      this.setState({ SARS: Fileadd, fileupods: true });
    } else {
      this.setState({ Positive_SARS: Fileadd, fileupods: true });
    }
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
  updateEntryState = async (e) => {
    const state = this.state.updateTrack;
    const retState = await update_entry_state(e, state, this.props.stateLoginValueAim)
    this.setState({ updateTrack: retState });
  };

  //For adding the Track entry
  AddTrack = () => {
    this.setState({ loaderImage: true });
    var data = this.state.updateTrack;
    var user_id = this.props.match.params.id;
    var user_token = this.props.stateLoginValueAim.token;
    if (this.state.isfileupload) {
      data.attachfile = this.state.fileattach;
    } else if (this.state.isfileuploadmulti) {
      data.attachfile = this.state.fileattach;
    }
    if (this.state.current_select === "vaccination_trial") {
      data.Positive_SARS = this.state.Positive_SARS;
      data.SARS = this.state.SARS;
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
            updateOne: 0,
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
      if (this.state.current_select === "promotion") {
        if (data?.option?.value === "all") {
          var UserId = this.state.PatientList && this.state.PatientList.length > 0 && this.state.PatientList.map((item) => {
            return item.value;
          })
          data.UserId = UserId;

        }
        axios
          .put(
            sitedata.data.path + "/User/AddTrackAdmin",
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
      else {
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
    }
    this.setState({ updateTrack: {} });
  };

  //For get the Track
  getTrack = async () => {
    var user_id = this.props.match.params.id;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    let response = await get_track(user_token, user_id)
    if (response?.data?.hassuccessed === true) {
      //This is for Aimedis Blockchain Section
      this.props.rightInfo();
      var images = [];
      response.data.data = response.data.data.filter((e) => e != null);
      // response.data.data &&
      //   response.data.data.length > 0 &&
      //   response.data.data.map((data1, index) => {
      //     var find2 = data1 && data1.created_by_image;
      //     if (find2) {
      //       var find3 = find2.split(".com/")[1];
      //       axios
      //         .get(sitedata.data.path + "/aws/sign_s3?find=" + find3)
      //         .then((response2) => {
      //           if (response2.data.hassuccessed) {
      //             images.push({
      //               image: find2,
      //               new_image: response2.data.data,
      //             });
      //             this.setState({ images: images });
      //           }
      //         });
      //     }
      // data1.attachfile &&
      //   data1.attachfile.length > 0 &&
      //   data1.attachfile.map((data, index) => {
      //     var find = data && data.filename && data.filename;
      //     if (find) {
      //       var find1 = find.split(".com/")[1];
      //       axios
      //         .get(sitedata.data.path + "/aws/sign_s3?find=" + find1)
      //         .then((response2) => {
      //           if (response2.data.hassuccessed) {
      //             images.push({
      //               image: find,
      //               new_image: response2.data.data,
      //             });
      //             this.setState({ images: images });
      //           }
      //         });
      //     }
      //   });
      // });

      this.props.rightInfo();
      this.setState({
        allTrack1: response.data.data,
        allTrack2: response.data.data,
        loaderImage: false,
        // defaultValue : 10,
      },
        () => { this.Showdefaults(this.state.allTrack2, this.state.defaultValue) });
    } else {
      this.setState({ allTrack1: [], allTrack: [], allTrack2: [], loaderImage: false });
    }

  };

  //Get All information Related to Metadata
  getMetadata() {
    this.setState({ allMetadata: this.props.metadata }, () => {
      this.GetLanguageMetadata();
    });
    // var user_token = this.props.stateLoginValueAim.token;
    // axios.get(sitedata.data.path + '/UserProfile/Metadata',
    //     {
    //         headers: {
    //             'token': user_token,
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     }).then((response) => {
    //         this.setState({ allMetadata: response.data[0] })
    //         this.GetLanguageMetadata();
    //     })
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
      var PromotionType = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.journal_promotion &&
        this.state.allMetadata.journal_promotion,
        this.props.stateLanguageType
      );
      var Anamnesis = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.anamnesis &&
        this.state.allMetadata.anamnesis,
        this.props.stateLanguageType
      );
      var vaccinations = GetLanguageDropdown(
        this.state.allMetadata &&
        this.state.allMetadata.vaccination &&
        this.state.allMetadata.vaccination,
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
        PromotionType: PromotionType,
        vaccinations: vaccinations,
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
        medication_unit: this.state.allMetadata?.medication_unit,
      });
    }
  };

  // Get the Current User Profile
  cur_one2 = async () => {
    var user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.match.params.id;
    let response = await get_cur_one(user_token, user_id)
    this.setState({ cur_one2: response?.data?.data });
  };

  //Get the Current User Profile
  cur_one = async () => {
    let user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.stateLoginValueAim.user._id;
    let response = await get_cur_one(user_token, user_id)
    this.setState({ cur_one: response.data.data });
  };

  //Move to Profile page
  MoveProfile = () => {
    this.props.history.push("/patient/");
  };
  //Move to Appointment Page
  MoveAppoint = () => {
    this.props.history.push("/patient/appointment");
  };

  //Get the All information of the Patient
  GetInfoForPatient = () => {
    this.getGender();
    this.cur_one();
    this.cur_one2();
    this.getUpcomingAppointment();
    this.props.rightInfo();

    this.getTrack();
    this.getPesonalized();
    this.handleCloseData();
  };

  getUpcomingAppointment() {
    var user_token = this.props.stateLoginValueAim.token;
    var user_id = this.props.match.params.id;
    axios
      .get(
        sitedata.data.path + "/UserProfile/UpcomingAppintmentPat/" + user_id,
        commonHeader(user_token)
      )
      .then((response) => {
        var upcomingData =
          response.data.data &&
          response.data.data.length > 0 &&
          response.data.data.filter(
            (data) => data.status !== "cancel" && data.status !== "remove"
          );
        this.setState({ upcoming_appointment: upcomingData });
      });
  }

  //For getting the existing settings
  getPesonalized = async () => {
    this.setState({ loaderImage: true });
    var user_id = this.props.match.params.id;
    let user_token = this.props.stateLoginValueAim.token
    let responce = await get_personalized(user_token, user_id)
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
    const { stateLoginValueAim } = this.props
    let response = await get_gender(stateLoginValueAim.token, this.props.match.params.id)
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
      long_covid,
      respiration,
      add_new_entry,
      New,
      entry,
      edit,
      blood_pressure,
      doc_visit,
      blood_sugar,
      covid_diary,
      condition_pain,
      diagnosis,
      diary,
      weight_bmi,
      vaccination,
      marcumar_pass,
      smoking_status,
      hosp_visit,
      lab_result,
      file_uplod,
      family_anmnies,
      medication,
      enter,
      VaccinationTrial,
      patient_access_data,
      another_patient_data,
      get_patient_access_data,
      id_pin_not_correct,
      healthcare_access_for_non_conn_patient,
      patient_id,
      pin,
      loadingref,
      enter_pin,
      Seemore10entries,
      view_data,
      prescription,
      secnd_openion,
      sick_cert,
      anamnesis,
    } = translate;
    const enter_patient_id = enter + " " + patient_id;
    const { stateLoginValueAim } = this.props;
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

              <Grid container direction="row">
                {/* Website Menu */}
                {/* End of Website Menu */}

                {/* Website Mid Content */}
                <Grid item xs={12} md={12}>
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

                                {
                                  this.props.match.params.id !== null && (
                                    <a onClick={this.handleOpenEntry}>
                                      + {add_new_entry}
                                    </a>
                                  )}
                              </Grid>
                              <Grid className="downloadButton">
                                <DownloadFullTrack
                                  TrackRecord={this.state.allTrack1}
                                />
                              </Grid>
                              <Grid className="downloadButton">
                                <VideoDemo />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* For the filter section */}
                    {this.props.match.params.id !== null && (
                      <FilterSec
                        FilterText={this.FilterText}
                        settings={this.props.settings}
                        FilterData={this.FilterData}
                        SortData={this.SortData}
                        ClearData={this.ClearData}
                        sortBy={this.state.Sort}
                      />
                    )}

                    {/* For Empty Entry */}
                    {this.props.match.params.id !== null && (
                      <div>
                        {this.state.allTrack &&
                          this.state.allTrack.length > 0 ? (
                          <div>
                            {this.state.allTrack.map((item, index) => (
                              <ViewTimeline
                                Opencare={(data) => this.props.Opencare(data)}
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
                                OpenGraph={this.props.OpenGraph}
                                comesfrom="adminstaff"
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
                                from="patient"
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
                    {/* <ViewTimeline date_format={this.props.settings && this.props.settings.setting && this.props.settings.setting.date_format}  time_format={this.props.settings && this.props.settings.setting && this.props.settings.setting.time_format} allTrack={this.state.allTrack} from="patient" loggedinUser={this.state.cur_one} patient_gender={this.state.patient_gender} /> */}
                  </Grid>
                </Grid>
                {/* End of Website Mid Content */}

                {/* Website Right Content */}

                <Modal
                  open={this.state.addInqryNw}
                  onClose={this.handleCloseInqryNw}
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode &&
                      this.props.settings.setting.mode === "dark"
                      ? "darkTheme nwDiaModel"
                      : "nwDiaModel"
                  }
                >
                  <Grid className="nwDiaCntnt">
                    <Grid className="nwDiaCntntIner">
                      <Grid className="nwDiaCourse">
                        <Grid container direction="row" justify="center">
                          <Grid item xs={12} md={12} lg={12}>
                            <Grid container direction="row" justify="center">
                              <Grid item xs={8} md={8} lg={8}>
                              <div>
                                {this.state.updateOne !==
                                  this.state.updateTrack.track_id ? (
                                    <p>
                                      {New} {entry}
                                    </p>
                                ) : (
                                    <p>
                                      {edit} {entry}
                                    </p>)}
                                    <Grid className="nwDiaSel">
                                      {this.state.current_select ===
                                        "anamnesis" && (
                                          <Grid className="nwDiaSel1">
                                            {anamnesis}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "blood_pressure" && (
                                          <Grid className="nwDiaSel1">
                                            {blood_pressure}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "blood_sugar" && (
                                          <Grid className="nwDiaSel1">
                                            {blood_sugar}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "condition_pain" && (
                                          <Grid className="nwDiaSel1">
                                            {condition_pain}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "covid_19" && (
                                          <Grid className="nwDiaSel1">
                                            {covid_diary}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "diagnosis" && (
                                          <Grid className="nwDiaSel1">
                                            {diagnosis}
                                          </Grid>
                                        )}
                                      {this.state.current_select === "diary" && (
                                        <Grid className="nwDiaSel1">{diary}</Grid>
                                      )}
                                      {this.state.current_select ===
                                        "doctor_visit" && (
                                          <Grid className="nwDiaSel1">
                                            {doc_visit}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "family_anamnesis" && (
                                          <Grid className="nwDiaSel1">
                                            {family_anmnies}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "file_upload" && (
                                          <Grid className="nwDiaSel1">
                                            {file_uplod}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "hospitalization" && (
                                          <Grid className="nwDiaSel1">
                                            {hosp_visit}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "laboratory_result" && (
                                          <Grid className="nwDiaSel1">
                                            {lab_result}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "long_covid" && (
                                          <Grid className="nwDiaSel1">
                                            {long_covid}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "marcumar_pass" && (
                                          <Grid className="nwDiaSel1">
                                            {marcumar_pass}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "medication" && (
                                          <Grid className="nwDiaSel1">
                                            {medication}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "prescription" && (
                                          <Grid className="nwDiaSel1">
                                            {prescription}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "second_opinion" && (
                                          <Grid className="nwDiaSel1">
                                            {secnd_openion}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "sick_certificate" && (
                                          <Grid className="nwDiaSel1">
                                            {sick_cert}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "smoking_status" && (
                                          <Grid className="nwDiaSel1">
                                            {smoking_status}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "vaccination" && (
                                          <Grid className="nwDiaSel1">
                                            {vaccination}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "vaccination_trial" && (
                                          <Grid className="nwDiaSel1">
                                            {VaccinationTrial}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "weight_bmi" && (
                                          <Grid className="nwDiaSel1">
                                            {weight_bmi}
                                          </Grid>
                                        )}
                                      {this.state.current_select ===
                                        "respiration" && (
                                          <Grid className="nwDiaSel1">
                                            {respiration}
                                          </Grid>
                                        )}
                                    </Grid>
                                  </div>
                              
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
                        </Grid>


                      </Grid>
                      <Grid>
                        {this.state.current_select === "anamnesis" && (
                          <AnamnesisFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            gender={this.state.patient_gender}
                            GetHideShow={this.GetHideShow}
                            options={this.state.Anamnesis}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select ===
                          "blood_pressure" && (
                            <BPFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              options={this.state.Pressuresituation}
                              AddTrack={this.AddTrack}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select === "blood_sugar" && (
                          <BSFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            options={this.state.Allsituation}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select ===
                          "condition_pain" && (
                            <CPFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              gender={this.state.patient_gender}
                              GetHideShow={this.GetHideShow}
                              options={this.state.Allpain_quality}
                              options2={this.state.Allpain_type}
                              AddTrack={this.AddTrack}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select === "covid_19" && (
                          <CovidFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            gender={this.state.patient_gender}
                            GetHideShow={this.GetHideShow}
                            options={this.state.selectCountry}
                            options2={this.state.Alltemprature}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select === "diagnosis" && (
                          <DiagnosisFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            gender={this.state.patient_gender}
                            GetHideShow={this.GetHideShow}
                            options={this.state.selectCountry}
                            options2={this.state.Alltemprature}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select === "diary" && (
                          <DiaryFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select === "doctor_visit" && (
                          <DVFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            AddTrack={this.AddTrack}
                            options={this.state.AllSpecialty}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select ===
                          "family_anamnesis" && (
                            <FAFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              AddTrack={this.AddTrack}
                              options={this.state.Allgender}
                              relativeList={this.state.Allrelation}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select === "file_upload" && (
                          <FUFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            AddTrack={this.AddTrack}
                            options={this.state.AllSpecialty}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select ===
                          "hospitalization" && (
                            <HVFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              AddTrack={this.AddTrack}
                              options={this.state.AllSpecialty}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select ===
                          "long_covid" && (
                            <CovidSymptomsField
                              cur_one={this.state.cur_one}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="patient"
                              gender={this.state.patient_gender}
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
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              lrpUnit={AllL_Ps.AllL_Ps.units}
                              lrpEnglish={AllL_Ps.AllL_Ps.english}
                              GetHideShow={this.GetHideShow}
                              AddTrack={this.AddTrack}
                              options={this.state.AllSpecialty}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select ===
                          "marcumar_pass" && (
                            <MPFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              AddTrack={this.AddTrack}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select === "medication" && (
                          <MedicationFields
                            cur_one={this.state.cur_one2}
                            lrpUnit={this.state.medication_unit}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            AddTrack={this.AddTrack}
                            date_format={
                              this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.date_format
                            }
                            options={this.state.AllATC_code}
                            reminders={this.state.Allreminder}
                            time_format={
                              this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.time_format
                            }
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select === "prescription" && (
                          <PFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            options={this.state.Pressuresituation}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select ===
                          "second_opinion" && (
                            <SOFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              options={this.state.Pressuresituation}
                              AddTrack={this.AddTrack}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select ===
                          "sick_certificate" && (
                            <SCFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              options={this.state.Pressuresituation}
                              AddTrack={this.AddTrack}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select ===
                          "smoking_status" && (
                            <SSFields
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              GetHideShow={this.GetHideShow}
                              options={this.state.Allsmoking_status}
                              AddTrack={this.AddTrack}
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
                              updateEntryState={this.updateEntryState}
                              updateEntryState1={this.updateEntryState1}
                              updateTrack={this.state.updateTrack}
                            />
                          )}
                        {this.state.current_select === "vaccination" && (
                          <VaccinationFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select ===
                          "vaccination_trial" && (
                            <VaccinationTrialFields
                              cur_one={this.state.cur_one2}
                              option4={this.state.vaccinations}
                              FileAttachMultiVaccination={
                                this.FileAttachMultiVaccination
                              }
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="patient"
                              gender={this.state.patient_gender}
                              GetHideShow={this.GetHideShow}
                              options3={this.state.Alltemprature}
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
                        {this.state.current_select === "weight_bmi" && (
                          <BMIFields
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="adminstaff"
                            GetHideShow={this.GetHideShow}
                            AddTrack={this.AddTrack}
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
                            updateEntryState={this.updateEntryState}
                            updateEntryState1={this.updateEntryState1}
                            updateTrack={this.state.updateTrack}
                          />
                        )}
                        {this.state.current_select === "respiration" && (
                          <RespirationField
                            cur_one={this.state.cur_one2}
                            FileAttachMulti={this.FileAttachMulti}
                            visibility={this.state.visibility}
                            comesfrom="patient"
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
                        {this.state.current_select ===
                          "promotion" && (
                            <PromotionFields
                              options={this.state.PromotionType}
                              PatientList={this.state.PatientList}
                              cur_one={this.state.cur_one2}
                              FileAttachMulti={this.FileAttachMulti}
                              visibility={this.state.visibility}
                              comesfrom="adminstaff"
                              AddTrack={this.AddTrack}
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
                <AddEntry
                  settings={this.props.settings}
                  new_entry={this.props.new_entry}
                  openBy="adminstaff"
                  openEntry={this.state.openEntry}
                  value="diagnosis"
                  onChange={this.SelectOption}
                  handleCloseEntry={this.handleCloseEntry}
                />
                {/* End of Model setup */}


                {/* End of Website Right Content */}
              </Grid>


            </Grid>
          </Grid>
        </Grid>
        <FloatArrowUp stateLanguageType={this.props.stateLanguageType} />
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
  const { verifyCode } = state.authy;
  const { metadata } = state.OptionList;
  const { House } = state.houseSelect;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    verifyCode,
    metadata,
    House,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    LoginReducerAim,
    OptionList,
    LanguageFetchReducer,
    Settings,
    authy,
    houseSelect,
  })(Index)
);
