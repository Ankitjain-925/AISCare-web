import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";
import Loader from "Screens/Components/Loader/index";
import { authy } from "Screens/Login/authy.js";
import { connect } from "react-redux";
import { LanguageFetchReducer } from "Screens/actions";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { commonHeader } from "component/CommonHeader/index";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction";
import { Speciality } from "Screens/Login/speciality.js";
import Button from "@material-ui/core/Button";
import SpecialityButton from "Screens/Components/VirtualHospitalComponents/SpecialityButton";
import axios from "axios";
import Select from "react-select";
import sitedata from "sitedata";
import SelectByTwo from 'Screens/Components/SelectbyTwo/index';
import _ from 'lodash';
import { GetShowLabel1 } from 'Screens/Components/GetMetaData/index.js';
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  AllRoomList,
  MoveInternalSpace,
  getSteps,
  AllWards,
  PatientMoveFromHouse,
  setWard,
  CurrentWard,
  CurrentRoom,
  setRoom,
  AllBed,
  CurrentBed,
  setBed,
} from "Screens/VirtualHospital/PatientFlow/data";
import SelectField from "Screens/Components/Select/index";
import { getLanguage } from "translations/index";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      specialitysec: false,
      changeStaffsec: this.props.changeStaffsec ? this.props.changeStaffsec : false,
      assignroom: false,
      firstsec: true,
      movepatsec: false,
      loaderImage: false,
      AllRoom: [],
      AllBeds: [],
      assignedTo: [],
      professional_id_list: [],
      professional_id_list1: [],
      professionalArray : [],

      setSec: false,
      updateQues: {},
      options: [{ label: "Individual", value: "individual" }, { label: "Group", value: "group" }],
      // options: []

    };
  }

  componentDidMount = () => {
    this.getListOption();
    this.UpdateDoc(this.props.quote?.assinged_to);
  };

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.changeStaffsec !== this.props.changeStaffsec
    ) {
      this.setState({
        changeStaffsec: this.props.changeStaffsec,
      });
    }
  };

UpdateDoc = (assinged_to) => {
    var getAllData =
      assinged_to &&
      assinged_to.length > 0 &&
      assinged_to.map((item) => {
        return item.user_id;
      });
    var professional_id_list = this.props.professional_id_list;
    var professionalArray = this.props.professionalArray;
    var professional_id_list1 = this.props.professional_id_list;
    if (getAllData) {
      professional_id_list =
        this.props.professional_id_list?.length > 0 &&
        this.props.professional_id_list.filter(
          (data) => !getAllData.includes(data.value) && data.label.indexOf('Staff') !== -1
        );
        professional_id_list1 =
        this.props.professional_id_list?.length > 0 &&
        this.props.professional_id_list.filter(
          (data) => !getAllData.includes(data.value) && data.label.indexOf('Staff') === -1
        );
      var setUpdates =
        this.props.professional_id_list?.length > 0 &&
        this.props.professional_id_list.filter((data) =>
          getAllData.includes(data.value)
        );
      this.setState({ assignedTo: setUpdates });
    }
    this.setState({ professional_id_list: professional_id_list, professional_id_list1: professional_id_list1, professionalArray: professionalArray });
  };

  getListOption = () => {
    var AllRoom = AllRoomList(
      this.props.quote?.speciality?._id,
      this.props.speciality?.SPECIALITY,
      this.props.quote?.wards?._id
    );
    this.setState({ AllRoom: AllRoom });
    this.GetAllBed();
  };
  updateAllEntrySec = (e, name, index) => {
    var state = this.state.updateQues;
    state = [{}];
    state[index][name] = e.value;
    this.setState({ openOpti: e.value && true });
    this.setState({ updateQues: state });
  };

  //Remove the Step
  RemoveDirectPatient = () => {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      RemovePatientfromFlow,


      
      patient_will_be_removed_and_cannot_be_reversed,
      are_you_sure,
      Yes_remove_patient,
      Cancel_keep_patient,
    } = translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Grid
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                ? "dark-confirm deleteStep"
                : "deleteStep"
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
                    src={require("assets/images/close-search.svg")}
                    alt=""
                    title=""
                  />
                </a>
              </Grid>
              <label>{RemovePatientfromFlow}</label>
            </Grid>
            <Grid className="deleteStepInfo">
              <p>{patient_will_be_removed_and_cannot_be_reversed}</p>
              <Grid>
                <label>{are_you_sure}</label>
              </Grid>
              <Grid>
                <Button
                  onClick={() => {
                    this.RemoveDirectPatientOk(5, false, false);
                    onClose();
                  }}
                >
                  {Yes_remove_patient}
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                >
                  {Cancel_keep_patient}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      },
    });
  };

  RemoveDirectPatientOk = (status, inhospital, viewQuestionaire) => {
    this.setState({ loaderImage: true });
    var response = PatientMoveFromHouse(
      this.props.quote._id,
      this.props.stateLoginValueAim.token,
      status,
      inhospital,
      viewQuestionaire
    );
    response.then((responce1) => {
      if (responce1.data.hassuccessed) {
        let users_id = this.state.professionalArray.map((item) => {
          return item?.user_id;
        })
        let profile_ids = this.state.professionalArray.map((item) => {
          return item?.profile_id;
        })
        axios.post(sitedata.data.path + "/cases/removemypatientdischarge", {
          User_id: users_id,
          profile_id: this.props.quote?.patient?.profile_id,
          profile_idf: profile_ids,

        }, commonHeader(this.props.stateLoginValueAim.token)).then((data) => {
        })
        this.setState({ loaderImage: false });
        var steps = getSteps(
          this.props?.House?.value,
          this.props.stateLoginValueAim.token
        );
        steps.then((data) => {
          var stepData = data ? data : [];
          this.props.setDta(stepData);
        });
      }
      this.setState({ loaderImage: false });
    });
  };

  setSpeciality = (data) => {
    this.setState({ loaderImage: true });
    axios
      .put(
        sitedata.data.path + "/cases/AddCase/" + this.props.quote._id,
        {
          speciality: {
            background_color: data.background_color,
            color: data.color,
            specialty_name: data.specialty_name,
            _id: data._id,
          },
          wards: {},
          rooms: {},
          bed: "",
        },
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((responce1) => {
        if (responce1.data.hassuccessed) {
          var steps = getSteps(
            this.props?.House?.value,
            this.props.stateLoginValueAim.token
          );
          steps.then((data) => {
            var stepData = data ? data : [];
            this.props.setDta(stepData);
            this.setState({ loaderImage: false });
          });
          this.setState({ loaderImage: false });
        }
      });
  };
  setsWard = (e) => {
    this.setState({ loaderImage: true });
    var response = setWard(
      e,
      this.props.quote?.speciality?._id,
      this.props.speciality?.SPECIALITY,
      this.props.quote._id,
      this.props.stateLoginValueAim.token
    );
    response.then((responce1) => {
      if (responce1.data.hassuccessed) {
        var steps = getSteps(
          this.props?.House?.value,
          this.props.stateLoginValueAim.token
        );
        steps.then((data) => {
          var stepData = data ? data : [];
          this.props.setDta(stepData);
          this.getListOption();
          this.setState({ loaderImage: false });
        });
        this.setState({ loaderImage: false });
      }
    });
  };
  //get the selected value of type of question
  SelectedValue = async (value) => {
    // var data = await getProfessionalData(
    //   this.state.selectedHouse?.value,
    //   this.props.stateLoginValueAim?.token
    // );
    var selected =
      this.state.options?.length > 0 && this.state.options.filter((e) => e.value === value);
    if (selected?.length > 0) return selected[0];
    return {};
  };

  setsRoom = (e) => {
    this.setState({ loaderImage: true });
    var response = setRoom(
      e,
      this.props.quote?.speciality?._id,
      this.props.speciality?.SPECIALITY,
      this.props.quote._id,
      this.props.stateLoginValueAim.token,
      this.props.quote?.wards?._id
    );
    response.then((responce1) => {
      if (responce1.data.hassuccessed) {
        var steps = getSteps(
          this.props?.House?.value,
          this.props.stateLoginValueAim.token
        );
        steps.then((data) => {
          var stepData = data ? data : [];
          this.props.setDta(stepData);
          this.getListOption();
          this.setState({ loaderImage: false });
        });
        this.setState({ loaderImage: false });
      }
    });
  };

  setsBed = (e) => {
    this.setState({ loaderImage: true });
    var response = setBed(
      e,
      this.props.quote._id,
      this.props.stateLoginValueAim.token
    );
    response.then((responce1) => {
      if (responce1.data.hassuccessed) {
        var steps = getSteps(
          this.props?.House?.value,
          this.props.stateLoginValueAim.token
        );
        steps.then((data) => {
          var stepData = data ? data : [];
          this.props.setDta(stepData);
        });
        this.setState({ loaderImage: false, setSec: false });
      }
    });
  };

  GetAllBed = async () => {
    if (
      this.props.quote?.speciality?._id &&
      this.props.quote?.wards?._id &&
      this.props.quote?.rooms?._id &&
      this.props?.House?.value
    ) {
      var response = await AllBed(
        this.props.quote?.speciality?._id,
        this.props.quote?.wards?._id,
        this.props.quote?.rooms?._id,
        this.props?.House?.value,
        this.props.stateLoginValueAim.token
      );
      var finalBed = [];
      if (response.data.hassuccessed) {
        var finalBed =
          response?.data?.data.length > 0 &&
          response?.data?.data.map((bed) => {
            return { value: bed, label: bed };
          });
        this.setState({ AllBeds: finalBed }, () => { });
      } else {
        this.setState({ AllBeds: [] });
      }
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.quote != this.props.quote) {
      this.UpdateDoc(this.props.quote?.assinged_to);
    }
  };
  //Select the professional name
  updateEntryState3 = (e,b) => {
    this.setState({ assignedTo: e,assignedTo2:'' }, () => {
      this.props.updateEntryState3(e, this.props.quote._id);
    });
    if (b =='group'){
      this.setState({ assignedTo2: e }, () => {
        this.props.updateEntryState3(e, this.props.quote._id);
      });
    }
  };

  Discharge = () => {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Discharge_Patient_in_This_Step,
      Patient_in_this_Step_will_be_discharged_from_the_flow,
      What_would_you_like_to_do,
      ok,
      Discharge_without_Invoices,
      Cancel,
    } = translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Grid
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                ? "dark-confirm deleteStep"
                : "deleteStep"
            }
          >
            <Grid className="dischargeHead">
              <Grid>
                <a
                  onClick={() => {
                    onClose();
                  }}
                >
                  <img
                    src={require("assets/images/close-search.svg")}
                    alt=""
                    title=""
                  />
                </a>
              </Grid>
              <h5>{Discharge_Patient_in_This_Step}</h5>
            </Grid>
            <Grid className="dischargeInfo">
              <p>{Patient_in_this_Step_will_be_discharged_from_the_flow}</p>
              <Grid>
                <label>{What_would_you_like_to_do}</label>
              </Grid>
              <Grid>
                {/* <Button
                  className="creatInvoic"
                  onClick={() => {
                    this.RemoveDirectPatientOk(1, true);
                    onClose();
                  }}
                >
                  {CreateInvoices}
                </Button> */}
                <Button
                  className="dischrgInvoic"
                  onClick={() => {
                    this.RemoveDirectPatientOk(4, false, true);
                    onClose();
                  }}
                >
                  {ok}
                </Button>
                <Button
                  className="dischrgCncl"
                  onClick={() => {
                    onClose();
                  }}
                >
                  {Cancel}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      },
    });
  };

  MovetoTask = () => {
    this.props.history.push({
      pathname: "/virtualhospital/tasks",
      state: {
        speciality: this.props.quote?.speciality,
        user: { value: this.props.quote?.patient_id },
      },
    });
  };

  MoveExternalSpace = () => {
    this.setState({ loaderImage: true });
    axios
      .post(
        sitedata.data.path + "/vc/UpdateAddress",
        {
          case_id: this.props.quote._id,
          house_id: this.props.quote?.house_id
        },
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((responce1) => {
        if (responce1.data.hassuccessed) {
          this.setState({ loaderImage: false });
          var steps = getSteps(
            this.props?.House?.value,
            this.props.stateLoginValueAim.token
          );
          steps.then((data) => {
            var stepData = data ? data : [];
            this.props.setDta(stepData);
          });
        } else {
          let translate = getLanguage(this.props.stateLanguageType);
          let {
            Discharge_Patient_in_This_Step,
            Patient_in_this_Step_will_be_discharged_from_the_flow,
            What_would_you_like_to_do,
            CreateInvoices,
            Discharge_without_Invoices,
            Cancel,
          } = translate;
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <Grid
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode === "dark"
                      ? "dark-confirm deleteStep"
                      : "deleteStep"
                  }
                >
                  <Grid className="dischargeHead">
                    <Grid>
                      <a
                        onClick={() => {
                          onClose();
                        }}
                      >
                        <img
                          src={require("assets/images/close-search.svg")}
                          alt=""
                          title=""
                        />
                      </a>
                    </Grid>
                    <h5>{"Need Patient Information"}</h5>
                  </Grid>
                  <Grid className="dischargeInfo">
                    <p>{"Patient need to fill their address / contact information completely. Before that hospital are not able to move patient as external space"}</p>

                    <Grid>
                      <Button
                        className="creatInvoic"
                        onClick={() => {
                          onClose();
                        }}
                      >
                        {"Ok"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              );
            },
          });
          this.setState({ loaderImage: false });
        }
      });
  };

  MovetoService = () => {
    this.props.history.push({
      pathname: '/virtualhospital/assignedservices',
      state: { openAssign: true }
    })
  }

  moveEntry = () => {
    this.props.history.push({
      pathname: `/virtualHospital/patient-detail/${this.props.quote.patient_id}/${this.props.quote._id}`,
      state: { data: true },
    });
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType)
    let { Staff, add_assign_service, AddSpecialty, ChangeStaff, AssignWardRoom, MovePatient, OpenDetails, add_new_entry, AddTask, Add_Appointment, change_staff, move_patient_to,
      assign_to_speciality, move_internal_space, assign_to_room, RemovePatientfromFlow, remove_patient, DischargePatient, Please_assign_speciality_first, Search_Select, Wards, Room, Bed } = translate;
    const { House: { roles = [] } = {} } = this.props || {}
    return (

      <>
        {this.state.loaderImage && <Loader />}
        <a className="academy_ul stepTdotupper">
          <img src={require('assets/images/three_dots_t.png')} alt="" title="" className="academyDots stepTdot" />
          <ul className={this.state.setSec && 'displayBlogCase'}  >
            {this.state.firstsec && <>
              {roles.includes("open_details") && <li><a onClick={() => { this.props.history.push(`/virtualHospital/patient-detail/${this.props.quote.patient_id}/${this.props.quote._id}/?view=4`) }}><span className="more-open-detail"></span>{OpenDetails}</a></li>}
              {roles.includes("add_entry") && <li><a onClick={() => { this.moveEntry() }}><span className="more-new-entry"></span>{add_new_entry}</a></li>}
              {roles.includes("add_task") && <li><a onClick={() => { this.MovetoTask() }}><span className="more-add-task"></span>{AddTask} </a></li>}
              <li><a onClick={() => { this.MovetoService() }}><span className="more-add-task"></span>{add_assign_service}</a></li>
              {roles.includes("Add_appointment") && <li><a onClick={() => { this.props.history.push(`/virtualHospital/patient-detail/${this.props.quote.patient_id}/${this.props.quote._id}/?view=5`) }}><span className="more-add-task"></span>{Add_Appointment} </a></li>}
              {roles.includes("change_staff") && <li><a onClick={() => { this.setState({ changeStaffsec: true, setSec: true, specialitysec: false, assignroom: false, movepatsec: false, firstsec: false }) }}><p className="more-change-staff-img"><span className="more-change-staff"></span><p className="more-change-staff-img2">{change_staff}<img src={require('assets/virtual_images/rightArrow.png')} alt="" title="" /></p></p></a></li>}
              {this.props.comesFrom !== "ExternalSpace" && roles.includes("move_patient") && <li><a onClick={() => { this.setState({ specialitysec: false, assignroom: false, changeStaffsec: false, movepatsec: true, firstsec: false }) }}><p className="more-change-staff-img"><span className="more-move-patient"></span><p className="more-change-staff-img2">{move_patient_to}<img src={require('assets/virtual_images/rightArrow.png')} alt="" title="" /></p></p></a></li>}
              {roles.includes("Assign_speciality") && <li><a onClick={() => { this.setState({ specialitysec: true, assignroom: false, changeStaffsec: false, movepatsec: false, firstsec: false }) }}><p className="more-change-staff-img"><span className="more-new-speciality"></span><p className="more-change-staff-img2">{assign_to_speciality}<img src={require('assets/virtual_images/rightArrow.png')} alt="" title="" /></p></p></a></li>}
              {!this.props.quote?.external_space && roles.includes("assign_room") && <li><a onClick={() => { this.setState({ assignroom: true, specialitysec: false, changeStaffsec: false, movepatsec: false, firstsec: false, setSec: true }) }}><p className="more-change-staff-img"><span className="more-assign-room"></span><p className="more-change-staff-img2">{assign_to_room}<img src={require('assets/virtual_images/rightArrow.png')} alt="" title="" /></p></p> </a></li>}
              {!this.props.quote?.external_space && roles.includes("move_external_space") && <li><a onClick={() => { this.MoveExternalSpace() }}><p className="more-change-staff-img"><span className="more-assign-room"></span><p className="more-change-staff-img2">{"Move to external space"}</p></p> </a></li>}
              {this.props.quote?.external_space && roles.includes("move_external_space") && <li><a onClick={() => { MoveInternalSpace(this.props.quote._id, this.props.stateLoginValueAim.token, this) }}><p className="more-change-staff-img"><span className="more-assign-room"></span><p className="more-change-staff-img2">{move_internal_space}</p></p> </a></li>}
              {this.props.quote?.status !== 1 && roles.includes("discharge_patient") && <li><a onClick={() => { this.Discharge() }}><span className="more-discharge-patient"></span>{DischargePatient}</a></li>}
              {this.props.quote?.status !== 1 && roles.includes("remove_patient") && <li><a onClick={() => { this.RemoveDirectPatient() }}><span className="more-remove-entry"></span>{remove_patient}</a></li>}
            </>}
            {this.state.specialitysec &&
              <div>
                <Grid className="movHead">
                  <Grid
                    onClick={() =>
                      this.setState({ firstsec: true, specialitysec: false })
                    }
                    className="movHeadLft"
                  >
                    <a>
                      <img
                        src={require("assets/virtual_images/arw1.png")}
                        alt=""
                        title=""
                      />
                    </a>
                  </Grid>
                  <Grid className="movHeadMid">
                    <label>{AddSpecialty}</label>
                  </Grid>
                  <Grid className="movHeadRght">
                    <a
                      onClick={() =>
                        this.setState({ firstsec: true, specialitysec: false })
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
                <Grid className="positionDrop">
                  {this.props.speciality?.SPECIALITY &&
                    this.props?.speciality?.SPECIALITY.length > 0 &&
                    this.props?.speciality?.SPECIALITY.map((data) => (
                      <div className="setSpcSpecList">
                        <SpecialityButton
                          label={data?.specialty_name}
                          backgroundColor={data?.background_color}
                          viewImage={false}
                          color={data?.color}
                          onClick={() => this.setSpeciality(data)}
                          showActive={
                            this.props.quote?.speciality?._id === data._id
                              ? true
                              : false
                          }
                        />
                      </div>
                    ))}
                </Grid>
              </div>
            }
            {this.state.changeStaffsec && (
              <div>
                <Grid className="movHead">
                  <Grid
                    onClick={() =>
                      this.setState({
                        setSec: false,
                        firstsec: true,
                        changeStaffsec: false,
                      })
                    }
                    className="movHeadLft"
                  >
                    <a>
                      <img
                        src={require("assets/virtual_images/arw1.png")}
                        alt=""
                        title=""
                      />
                    </a>
                  </Grid>
                  <Grid className="movHeadMid">
                    <label>{ChangeStaff}</label>
                  </Grid>
                  <Grid className="movHeadRght">
                    <a
                      onClick={() =>
                        this.setState({
                          setSec: false,
                          firstsec: true,
                          changeStaffsec: false,
                          openOpti: false
                        })
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
                <Grid className="positionDrop">
                  <SelectByTwo
                    name="staff"
                    options={this.state.options}
                    onChange={(e) =>
                      this.updateAllEntrySec(e, "staff", 0)

                    }
                    value={this.SelectedValue(GetShowLabel1(this.state.options, this.state.updateQues[0]?.staff,
                    ))}

                  />
                </Grid>
                  {(this.state.openOpti === true && this.state.updateQues[0]?.staff=== "individual") && <>
                    <Grid className="seletDrop">
                      <label>{this.state.updateQues[0]?.staff}</label>
                      <Select
                        name="staff"
                        className="addStafSelect"
                        options={this.state.professional_id_list1}
                        isMulti={false}
                        onChange={(e) =>
                          this.updateEntryState3(e)}
                        value={this.state.assignedTo}
                      />
                    </Grid>
                  </>}
                    
                  {(this.state.openOpti === true && this.state.updateQues[0]?.staff=== "group") && <>
                    <Grid className="seletDrop">
                      <label>{this.state.updateQues[0]?.staff}</label>
                      <Select
                        name="staff1"
                        className="addStafSelect"
                        options={this.state.professional_id_list}
                       isMulti={true}
                       onChange={(e) =>
                        this.updateEntryState3(e,'group')}
                      value={this.state.assignedTo2}
                    
                      />
                    </Grid>
                  </>}
              </div>
            )}   
           

            {this.state.assignroom && (
              <div>
                <Grid className="movHead">
                  <Grid
                    onClick={() =>
                      this.setState({
                        firstsec: true,
                        assignroom: false,
                        setSec: false,
                      })
                    }
                    className="movHeadLft"
                  >
                    <a>
                      <img
                        src={require("assets/virtual_images/arw1.png")}
                        alt=""
                        title=""
                      />
                    </a>
                  </Grid>
                  <Grid className="movHeadMid">
                    <label>{AssignWardRoom}</label>
                  </Grid>
                  <Grid className="movHeadRght">
                    <a
                      onClick={() =>
                        this.setState({
                          setSec: false,
                          firstsec: true,
                          assignroom: false,
                        })
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
                <Grid className="positionDrop">
                  {this.props.quote?.speciality?._id ? (
                    <Grid className="cnfrmDiaMain">
                      <Grid className="fillDias">
                        <Grid>
                          <SelectField
                            isSearchable={true}
                            name="type"
                            label={Wards}
                            option={AllWards(
                              this.props.quote?.speciality?._id,
                              this.props.speciality?.SPECIALITY
                            )}
                            onChange={(e) => this.setsWard(e)}
                            value={CurrentWard(this.props.quote?.wards)}
                            className="addStafSelect1"
                          />
                        </Grid>
                        {this.props.quote?.wards?._id && (
                          <Grid>
                            <SelectField
                              isSearchable={true}
                              name="type"
                              label={Room}
                              option={this.state.AllRoom}
                              onChange={(e) => this.setsRoom(e)}
                              value={CurrentRoom(this.props.quote?.rooms)}
                              className="addStafSelect1"
                            />
                          </Grid>
                        )}
                        {this.props.quote?.rooms?._id && (
                          <Grid>
                            <SelectField
                              isSearchable={true}
                              name="type"
                              label={Bed}
                              option={this.state.AllBeds}
                              onChange={(e) => this.setsBed(e)}
                              value={CurrentBed(this.props.quote?.bed)}
                              className="addStafSelect1"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  ) : (
                    <div className="err_message">
                      {Please_assign_speciality_first}
                    </div>
                  )}
                </Grid>
              </div>
            )}
            {this.state.movepatsec && (
              <div>
                <Grid className="movHead">
                  <Grid
                    onClick={() =>
                      this.setState({ firstsec: true, movepatsec: false })
                    }
                    className="movHeadLft"
                  >
                    <a>
                      <img
                        src={require("assets/virtual_images/arw1.png")}
                        alt=""
                        title=""
                      />
                    </a>
                  </Grid>
                  <Grid className="movHeadMid">
                    <label>{MovePatient}</label>
                  </Grid>
                  <Grid className="movHeadRght">
                    <a
                      onClick={() =>
                        this.setState({ firstsec: true, movepatsec: false })
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
                <Grid className="positionDrop">
                  {this.props.ordered?.length > 0 &&
                    this.props.ordered.map((item) => (
                      <Grid>
                        <label
                          onClick={() => {
                            this.props.onDragEnd({
                              type: "QUOTE",
                              draggableId: this.props.quote.patient_id,
                              source: {
                                droppableId: this.props.currentStep,
                                index: this.props.currentIndex,
                              },
                              destination: {
                                droppableId: item,
                                index: this.props.columns[item]?.length,
                              },
                            });
                          }}
                        >
                          {item}
                        </label>
                      </Grid>
                    ))}
                </Grid>
              </div>
            )}
          </ul>
        </a>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { stateLoginValueAim,loadingaIndicatoranswerdetail } = state.LoginReducerAim;
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
