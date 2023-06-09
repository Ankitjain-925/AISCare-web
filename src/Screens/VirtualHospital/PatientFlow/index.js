import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import Input from '@material-ui/core/Input';
import Select from 'react-select';
import Loader from 'Screens/Components/Loader/index';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { getPatientData } from 'Screens/Components/CommonApi/index';
import { PatientFlowFilter } from '../../Components/MultiFilter/index';
import {
  getSteps,
  getAuthor,
  updateInActualData,
  MoveAllCases,
  setAssignedTo,
  getProfessionalData,
} from './data';
import Drags from './drags.js';
import sitedata from 'sitedata';
import { withRouter } from 'react-router-dom';
import { authy } from 'Screens/Login/authy.js';
import { connect } from 'react-redux';
import { LanguageFetchReducer } from 'Screens/actions';
import { LoginReducerAim } from 'Screens/Login/actions';
import { Settings } from 'Screens/Login/setting';
import Modal from '@material-ui/core/Modal';
import { commonHeader } from 'component/CommonHeader/index';
import { houseSelect } from '../Institutes/selecthouseaction';
import Button from '@material-ui/core/Button';
import LeftMenu from 'Screens/Components/Menus/VirtualHospitalMenu/index';
import LeftMenuMobile from 'Screens/Components/Menus/VirtualHospitalMenu/mobile';
import _ from 'lodash';
import { Redirect, Route } from 'react-router-dom';
import { getLanguage } from 'translations/index';
import { Speciality } from 'Screens/Login/speciality.js';
import QrReader from 'react-qr-reader';
import VHfield from 'Screens/Components/VirtualHospitalComponents/VHfield/index';
import DateFormat from 'Screens/Components/DateFormat/index';
import ReactFlagsSelect from 'react-flags-select';
import {SocketIo, clearScoket} from "socket";
// import io from 'socket.io-client';
// import { GetSocketUrl } from 'Screens/Components/BasicMethod/index';
// const SOCKET_URL = GetSocketUrl();

// var socket;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      view: 'vertical',
      openAddP: false,
      fullData: {},
      actualData: [],
      edit: false,
      addp: {},
      case: {},
      caseAlready: false,
      searchValue: '',
      idpinerror: false,
      openPopup: false,
      SelectedStep: '',
      errorMsg: '',
      StepService: {},
      StepNameList: [],
      name: '',
      inOtherAlready: false,
      alreadyData: {},
      search: {},
      selectWard: '',
      wardList: [],
      selectRoom: '',
      roomList: [],
      selectedPat: '',
      assignedTo2: '',
      allWards: '',
      filteredData: '',
      result: 'No result',
      enableEmail: 'scan',
      updateState: {},
      flag_fax: 'DE',
      flag_phone: 'DE',
      flag_mobile: 'DE',
      flag_emergency_number: 'DE',
      mobile: '',
      phone: '',
      fax: '',
      msgState: '',
      enableScan: true,
    };
    // socket = io(SOCKET_URL);
  }
  static defaultProps = {
    isCombineEnabled: false,
  };
  boardRef;

  handleError = (err) => { };

  handleEnableEmail = (value) => {
    this.setState({
      enableEmail: value,
      updateState: {},
      msgState: '',
      enableScan: true,
    });
  };

  handleOpenPopup = () => {
    this.setState({ openPopup: true });
  };

  handleClosePopup = () => {
    this.setState({ openPopup: false, step_name: '', stepError: '' });
  };

  componentDidMount() {
    // socket.on('connection', () => { });
    this.getPatientData();
    this.getProfessionalData();
    var steps = getSteps(
      this.props?.House?.value,
      this.props.stateLoginValueAim.token
    );
    steps.then((data) => {
      var stepData = data ? data : [];
      this.setDta(stepData);
      this.GetStep();
    });

    // var specsMap1 = [{ label: 'All Specialities', value: 'all' }];
    var specsMap =
      this.props.speciality &&
      this.props.speciality?.SPECIALITY?.length > 0 &&
      this.props.speciality?.SPECIALITY.map((item) => {
        return { label: item.specialty_name, value: item._id };
      });
    // if (specsMap && specsMap?.length > 0) {
    // specsMap = [...specsMap1, ...specsMap];
    this.setState({ specialitiesList: specsMap });
    // }
    // else {
    //   this.setState({ specialitiesList: specsMap1 });
    // }
  }

  GetStep = () => {
    var state = this.state.actualData;
    let allSteps =
      state &&
      state.length > 0 &&
      state.map((item) => {
        return { label: item && item.step_name, vlaue: item && item._id };
      });
    this.setState({ StepNameList: allSteps });
  };

  MovetoTask = (speciality, patient_id) => {
    this.props.history.push({
      pathname: '/virtualhospital/tasks',
      state: { speciality: speciality, user: { value: patient_id } },
    });
  };

  MovetoService = () => {
    this.props.history.push({
      pathname: '/virtualhospital/assignedservices',
      state: { openAssign: true },
    });
  }

  moveDetial = (id, case_id) => {
    this.props.history.push(`/virtualhospital/patient-detail/${id}/${case_id}`);
  };

  //For calling the API
  CallApi = () => {
    var deep = _.cloneDeep(this.state.actualData);
    deep.map((item) => {
      item.case_numbers = item.case_numbers.map((element) => {
        if (element._id) {
          let case_id = element._id;
          element = {};
          element.case_id = case_id;
          return element;
        } else {
          return element;
        }
      });
    });
    this.setState({ loaderImage: true });
    axios
      .post(
        sitedata.data.path + '/step/AddStep',
        {
          house_id: this.props?.House?.value,
          steps: deep,
        },
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((responce) => {
        if (responce.data.hassuccessed) {
          this.setState({ loaderImage: false });
          var steps = getSteps(
            this.props?.House?.value,
            this.props.stateLoginValueAim.token
          );
          steps.then((data) => {
            var stepData = data ? data : [];
            this.setDta(stepData);
          });
        }
        this.setState({});
      });
  };

  //Select the professional name
  updateEntryState3 = (e, case_id) => {
    if (!e?.length) {
      let a = [];
      a.push(e);
      e = a;
    }
    var data =
      e?.length > 0 &&
      e.reduce((last, current) => {
        let isProf =
          this.state.professionalArray?.length > 0 &&
          this.state.professionalArray.filter(
            (data) => data?.user_id === current?.value || data?._id === current?.value
          );
        if (isProf && isProf.length > 0) {
          last.push(isProf[0]);
        }
        return last;
      }, []);
    data = data ? data : [];
    this.setState({ loaderImage: true, changeStaffsec: false });
    var response = setAssignedTo(
      data,
      case_id,
      this.props.stateLoginValueAim.token
    );
    response.then((responce1) => {
      if (responce1?.data?.hassuccessed) {
        var steps = getSteps(
          this.props?.House?.value,
          this.props.stateLoginValueAim.token
        );
        steps.then((data) => {
          var stepData = data ? data : [];
          this.setDta(stepData);
        });
        this.setState({ loaderImage: false, updateQues: {} });
      } else {
        this.setState({ loaderImage: false });
      }
    });
  };
  // Get the Professional data
  getProfessionalData = async () => {
    this.setState({ loaderImage: true });
    var data = await getProfessionalData(
      this.props?.House?.value,
      this.props.stateLoginValueAim.token
    );
    if (data) {
      this.setState({
        loaderImage: false,
        professionalArray: data.professionalArray,
        professional_id_list: data.professionalList,
      });
    } else {
      this.setState({ loaderImage: false });
    }
  };

  //Change the value of the step_name
  onChange = (e, index) => {
    var state = this.state.actualData;
    if (e.target.value !== '') {
      var changes = state.filter((newa) => {
        return newa.step_name?.toLowerCase() === e.target?.value?.toLowerCase();
      });
      if (!(changes?.length > 0)) {
        state[index][e.target.name] = e.target.value;
        this.setDta(state);
        this.setState({ edit: false });
        this.CallApi();
      }
    }
  };

  //Edit the name of step
  editName = (index) => {
    this.setState({ edit: index });
  };

  //Add new step
  AddStep = () => {
    this.setState({ openPopup: true });
  };

  handleName = (e) => {
    this.setState({ step_name: e.target.value });
  };

  OnAdd = () => {
    let translate = getLanguage(this.props.stateLanguageType);
    let { Step_name_already_exist } = translate;
    this.setState({ stepError: '' });
    var state = this.state.actualData;
    let allSteps =
      state &&
      state.length > 0 &&
      state.map((item) => {
        return item && item.step_name.toLowerCase();
      });
    let check =
      allSteps?.length > 0 &&
      allSteps.includes(this.state.step_name.toLowerCase());
    if (check === false) {
      state.push({ step_name: this.state.step_name, case_numbers: [] });
      this.setDta(state);
      this.CallApi();
      this.GetStep();
      this.setState({ openPopup: false, step_name: '' });
    } else if (check === true) {
      this.setState({ stepError: Step_name_already_exist });
    }
  };

  //Set data according to package
  setDta = (stepData) => {
    var author = getAuthor(stepData);
    stepData.map((item, index1) => {
      item?.case_numbers?.length > 0 &&
        item.case_numbers.map((data, index) => {
          data['author'] = author[index1];
        });
    });
    this.setState({ actualData: stepData });
    this.mapActualToFullData(stepData);
  };

  //Open case model
  openAddPatient = (step_name = '') => {
    if (step_name && step_name !== '') {
      var finalsection =
        this.state.StepNameList?.length > 0 &&
        this.state.StepNameList.filter(
          (data) => data.label.toLowerCase() == step_name.toLowerCase()
        );
      if (finalsection && finalsection.length > 0) {
        this.setState({ SelectedStep: finalsection[0] });
      }
    }
    this.setState({ openAddP: true, addp: {}, idpinerror: false, case: {} });
  };

  //Close case model
  closeAddP = () => {
    this.setState({
      openAddP: false,
      SelectedStep: '',
      result: 'No result',
      enableEmail: 'scan',
      updateState: {},
      errorMsg: '',
      msgState: '',
      enableScan: true,
    });
  };

  // Set patient and status data
  onFieldChange1 = (e, name) => {
    const state = this.state.search;
    state[name] =
      e && e.length > 0
        ? e.map((item) => {
          return item.value;
        })
        : [];
    this.setState({ selectedPat: e });
    this.setState({ search: state });
  };

  handleStaff = (e) => {
    this.setState({ assignedTo2: e });
  };

  //Delete the Step
  DeleteStep = (index) => {
    var state = this.state.actualData;

    var index = index;
    if (state[index]?.case_numbers?.length > 0) {
      let translate = getLanguage(this.props.stateLanguageType);
      let {
        deleteStep,
        yes_deleteStep,
        all_patient_removed_cannot_be_reversed,
        are_you_sure,
        cancel_keepStep,
      } = translate;
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <Grid
              className={
                this.props.settings &&
                  this.props.settings.setting &&
                  this.props.settings.setting.mode === 'dark'
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
                <label>{deleteStep}</label>
              </Grid>
              <Grid className="deleteStepInfo">
                <p>{all_patient_removed_cannot_be_reversed}</p>
                <Grid>
                  <label>{are_you_sure}</label>
                </Grid>
                <Grid>
                  <Button
                    onClick={() => {
                      this.removestep2(state, index);
                    }}
                  >
                    {yes_deleteStep}
                  </Button>
                  <Button
                    onClick={() => {
                      onClose();
                    }}
                  >
                    {cancel_keepStep}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      });
    } else {
      this.DeleteStepOk(state, index);
    }
  };

  removestep2 = (state, index) => {
    var state = this.state.actualData;
    var index = index;
    let translate = getLanguage(this.props.stateLanguageType);
    let { removeStep, really_want_to_remove, No, Yes } = translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === 'dark'
                ? 'dark-confirm react-confirm-alert-body'
                : 'react-confirm-alert-body'
            }
          >
            <h1 class="alert-btn">{removeStep}</h1>
            <p>{really_want_to_remove}</p>
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>{No}</button>
              <button
                onClick={() => {
                  this.DeleteStepOk(state, index);
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

  DeleteStepOk = (state, index) => {
    var yt = state[index]?.case_numbers.map((item) => {
      return item._id;
    });
    this.setState({ loaderImage: true });
    axios
      .post(
        sitedata.data.path + '/vh/setCasenotInhospital',
        { case_id: yt },
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((responce) => {
        if (responce.data.hassuccessed) {
          this.setState({ loaderImage: false });
          state.splice(index, 1);
          this.setDta(state);
          this.CallApi();
          this.GetStep();
        } else {
          this.setState({ loaderImage: false });
        }
      });
  };

  //Update the states
  updateEntryState8 = (e) => {
    const state = this.state.updateState;
    if (e.target.name === 'mobile') {
      state[e.target.name] = this.state.flag_mobile + '-' + e.target.value;
      this.setState({ mobile: e.target.value });
    }
    this.setState({ updateState: state });
  };

  //For update the mobile number
  updateMOBILE = (str) => {
    if (!str || str === 'undefined' || str === null || str === '') {
      return str;
    } else {
      var mob = str && str.split('-');
      return mob.pop();
    }
  };

  // fOR update the flag of mobile
  updateFLAG = (str) => {
    var mob = str && str.split('-');
    if (mob && mob.length > 0) {
      if (mob[0] && mob[0].length == 2) {
        return mob[0];
      } else {
        return 'DE';
      }
    }
  };

  //For update the flags
  updateFlags = (e, name) => {
    const state = this.state.updateState;
    if (name === 'flag_mobile') {
      state['mobile'] = e + '-' + this.state.mobile;
      this.setState({ flag_mobile: e });
    }
    this.setState({ updateState: state });
  };

  handleScan = (data, name) => {
    const state = this.state.updateState;
    if (data) {
      state[name] = data;
      this.setState({
        updateState: state,
        msgState: 'Scan successfully processed further',
        enableScan: false,
      });
    }
  };

  updateEntryState1 = (e, name) => {
    const state = this.state.updateState;
    if (name === 'email') {
      state[name] = e.target.value;
    } else {
      if (name === 'birthday') {
        state[name] = e;
      } else {
        state[name] = e.target.value;
      }
    }
    this.setState({ updateState: state });
  };

  //On Add case
  AddCase = () => {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Please_enter_case_number,
      Please_select_step,
      Please_add_email_of_patient,
      Please_enter_information_of_patient,
    } = translate;
    this.setState({ errorMsg: '' });
    var data = this.state.updateState;
    if (!data.birthday) {
      data.birthday = new Date();
    }
    if (data && !this.state.case.case_number) {
      this.setState({ errorMsg: Please_enter_case_number });
    } else if (data && !this.state.SelectedStep) {
      this.setState({ errorMsg: Please_select_step });
    } else if (!data.email && this.state.enableEmail === 'email') {
      this.setState({ errorMsg: Please_add_email_of_patient });
    } else if (
      (!data?.first_name ||
        (!data?.last_name && !data.birthday) ||
        !data.mobile) &&
      this.state.enableEmail === 'other'
    ) {
      this.setState({
        errorMsg: Please_enter_information_of_patient,
      });
    } else {
      data.institute_id =
        this.props.stateLoginValueAim?.user?.institute_id?.length > 0
          ? this.props.stateLoginValueAim?.user?.institute_id[0]
          : '';
      data.house_id = this.props?.House.value;
      // this.setState({ loaderImage: true });
      axios
        .post(
          sitedata.data.path + '/vh/checkPatient1',
          data,
          commonHeader(this.props.stateLoginValueAim.token)
        )
        .then((responce) => {
          if (responce.data.hassuccessed) {
            var case_data = {
              birthday: data.birthday,
              house_id: this.props?.House.value,
              inhospital: true,
              case_number: this.state.case.case_number,
              patient_id: responce.data.data._id,
              patient: {
                first_name: responce.data.data?.first_name,
                last_name: responce.data.data?.last_name,
                image: responce.data.data.image,
                profile_id: responce.data.data.profile_id,
                alies_id: responce.data.data.alies_id,
              },
              added_at: new Date(),
              verifiedbyPatient: false,
            };
            if (responce.data.data?.type !== 'patient') {
              this.setState({ idpinerror: true, loaderImage: false });
            } else {
              this.setState({ idpinerror: false });
              axios
                .post(
                  sitedata.data.path + '/cases/AddCase',
                  case_data,
                  commonHeader(this.props.stateLoginValueAim.token)
                )
                .then((responce1) => {
                  if (responce1.data.hassuccessed) {
                    var senddata = {};
                    if (this.state.enableEmail === 'scan') {
                      senddata.email = responce.data.data?.email;
                      senddata.mobile = responce.data.data?.mobile;
                    } else {
                      if (this.state.updateState?.email) {
                        senddata.email = this.state.updateState?.email;
                      }
                      if (this.state.updateState?.mobile) {
                        senddata.mobile = this.state.updateState?.mobile;
                      }
                    }
                    senddata.case_id = responce1.data?.data;
                    senddata.patient = responce.data.data._id;
                    senddata.patient_name = responce.data.data?.last_name
                      ? responce.data.data?.first_name +
                      ' ' +
                      responce.data.data?.last_name
                      : responce.data.data?.first_name;
                    senddata.house_id = this.props.House?.value;
                    axios
                      .post(
                        sitedata.data.path + '/vh/linkforAccepthospital',
                        senddata,
                        commonHeader(this.props.stateLoginValueAim.token)
                      )
                      .then((responce1) => { });
                    this.setState({
                      updateState: {},
                      idpinerror: false,
                      openAddP: false,
                      case: {},
                      addp: {},
                    });
                    var state = this.state.actualData;
                    let indexData = '';
                    state &&
                      state.length > 0 &&
                      state.filter((item, index) => {
                        if (
                          item.step_name.toLowerCase() ==
                          this.state.SelectedStep.label.toLowerCase()
                        ) {
                          indexData = index;
                        }
                      });
                    state[indexData].case_numbers.push({
                      case_id: responce1.data.data,
                    });
                    this.setState({ SelectedStep: '' });
                    this.setDta(state);
                    this.CallApi();
                  } else {
                    this.setState({ caseAlready: true, loaderImage: false });
                    setTimeout(() => {
                      this.setState({ caseAlready: false });
                    }, 3000);
                  }
                });
            }
          } else {
            if (responce.data.data) {
              this.setState({
                inOtherAlready: true,
                loaderImage: false,
                alreadyData: responce.data.data,
              });
            } else {
              this.setState({ idpinerror: true, loaderImage: false });
            }
            setTimeout(() => {
              this.setState({
                idpinerror: false,
                inOtherAlready: false,
                alreadyData: {},
              });
              if (this.state.enableEmail === 'other') {
                this.closeAddP();
                this.props.history.push('/virtualhospital/new-user');
              } else {
                this.handleEnableEmail(
                  this.state.enableEmail === 'email' ? 'other' : 'email'
                );
              }
            }, 2000);
          }
        });
    }
  };

  //On change the case
  onChangeCase = (e) => {
    var state = this.state.case;
    state[e.target.name] = e.target.value;
    this.setState({ case: state });
  };

  //On change the id or pin
  changeAddp = (e) => {
    var state = this.state.addp;
    state[e.target.name] = e.target.value;
    this.setState({ addp: state });
  };

  onChooseSpeciality = (selectedOption) => {
    this.setState({ selectedOption });
    const searchQuery = selectedOption.value;
    let result = this.state.actualData;
    var actualData = _.cloneDeep(this.state.actualData);
    if (searchQuery !== 'all') {
      result =
        actualData &&
        actualData.length > 0 &&
        actualData.map((item) => {
          var getdata =
            item &&
            item.case_numbers &&
            item.case_numbers.length > 0 &&
            item.case_numbers.filter((value) => {
              const specialityId = value.speciality?._id;
              let testCondition = specialityId === searchQuery;
              return testCondition;
            });
          item.case_numbers = getdata.length > 0 ? getdata : [];
          return item;
        });
    }
    this.mapActualToFullData(result);
  };

  //for selecting Step name
  onSelectingStep = (e) => {
    this.setState({ SelectedStep: e });
  };

  moveStep = (to, from, item) => {
    var result = {
      type: 'COLUMN',
      draggableId: item,
      source: { droppableId: 'board', index: from },
      destination: { droppableId: 'board', index: to },
    };
    var actualData = updateInActualData(this.state.actualData, result);
    actualData.then((result) => {
      this.setState({ actualData: result }, () => {
        this.CallApi();
      });
    });
  };

  dragDropFlow = (result) => {
    var actualData = updateInActualData(this.state.actualData, result);
    actualData.then((result) => {
      this.setState({ actualData: result }, () => {
        this.CallApi();
      });
    });
  };

  moveAllPatient = (to, from, data) => {
    var to32 =
      this.state.actualData.length > 0 &&
      this.state.actualData
        .map(function (e) {
          return e.step_name;
        })
        .indexOf(to);
    var actualData = MoveAllCases(this.state.actualData, from, to32, data);
    actualData.then((result) => {
      this.setState({ actualData: result }, () => {
        this.CallApi();
      });
    });
  };

  handleSearch = (event) => {
    const searchQuery = event.target.value;
    var actualData = _.cloneDeep(this.state.actualData);
    this.setState({
      [event.target.name]: event.target.value,
    });
    let result =
      actualData &&
      actualData.length > 0 &&
      actualData.map((item) => {
        var getdata =
          item &&
          item.case_numbers &&
          item.case_numbers.length > 0 &&
          item.case_numbers.filter((value) => {
            const patientFirstName = value.patient?.first_name.toLowerCase();
            const patientLastName = value.patient?.last_name.toLowerCase();
            const patientId = value.patient.alies_id.toLowerCase();
            const patientFullName = `${value.patient?.first_name.toLowerCase()} ${value.patient?.last_name.toLowerCase()}`;
            let testCondition =
              patientFirstName.includes(searchQuery) ||
              patientLastName.includes(searchQuery) ||
              patientId.includes(searchQuery) ||
              patientFullName.includes(searchQuery);
            return testCondition;
          });
        item.case_numbers = getdata.length > 0 ? getdata : [];
        return item;
      });
    this.mapActualToFullData(result);
  };

  newPatient = () => {
    this.props.history.push('/virtualHospital/new-user');
  };

  filterResult = () => {
    let {
      selectedPat,
      assignedTo2,
      selectSpec2,
      selectWard,
      selectRoom,
      actualData,
    } = this.state;
    var data = _.cloneDeep(actualData);
    let result = PatientFlowFilter(
      selectedPat,
      assignedTo2,
      selectSpec2,
      selectWard,
      selectRoom,
      data
    );
    this.mapActualToFullData(result);
    this.setState({ filteredData: 'filterApply' });
    this.handleCloseFil();
  };

  clearFilter = () => {
    this.setState({
      selectedOption: null,
      filteredData: '',
      selectedPat: '',
      assignedTo2: '',
      selectSpec2: '',
      selectWard: '',
      wardList: [],
      roomList: [],
      selectRoom: '',
    });
    this.mapActualToFullData(this.state.actualData);
    this.handleCloseFil();
  };

  // clearFilters = () => {
  //   this.setState({
  //     searchValue: '',
  //     selectedOption: { label: 'All Specialities', value: 'all' }
  //   });
  //   this.mapActualToFullData(this.state.actualData);
  // }

  mapActualToFullData = (result) => {
    var socket = SocketIo();
    socket.on('email_decline', (data) => {
      let result1 = result.map((element) => {
        var finalData =
          element?.case_numbers?.length > 0 &&
          element.case_numbers.filter(
            (element2) => element2._id !== data.case_id
          );
        element.case_numbers = finalData ? finalData : [];
        return element;
      });
      const authorQuoteMap =
        result1 &&
        result1?.length > 0 &&
        result1.reduce((previous, author) => {
          if (previous && !previous.hasOwnProperty(author.step_name))
            previous = { ...previous, [author.step_name]: author.case_numbers };
          return previous;
        }, {});

      this.setState({ fullData: authorQuoteMap });
    });
    const authorQuoteMap =
      result &&
      result?.length > 0 &&
      result.reduce((previous, author) => {
        if (previous && !previous.hasOwnProperty(author.step_name))
          previous = { ...previous, [author.step_name]: author.case_numbers };
        return previous;
      }, {});

    this.setState({ fullData: authorQuoteMap });
  };

  handleCloseFil = () => {
    this.setState({ openFil: false });
  };

  handleOpenFil = () => {
    this.setState({ openFil: true });
  };

  // Get the Patient data
  getPatientData = async () => {
    this.setState({ loaderImage: true });
    let response = await getPatientData(
      this.props.stateLoginValueAim.token,
      this.props?.House?.value
    );
    if (response?.isdata) {
      this.setState(
        { users1: response.PatientList1, users: response.patientArray },
        () => {
          if (this.props.location?.state?.user) {
            let user =
              this.state.users1.length > 0 &&
              this.state.users1.filter(
                (user) => user.value === this.props.location?.state?.user.value
              );

            if (user?.length > 0) {
              this.setState({ q: user[0]?.name, selectedUser: user[0] });
            }
            this.updateEntryState2(this.props.location?.state?.user);
          }
        }
      );
    } else {
      this.setState({ loaderImage: false });
    }
  };

  // //Change the UserList
  // onChange = (event) => {
  //   const q = event.target.value.toLowerCase();
  //   this.setState({ q }, () => this.filterList());
  // };

  filterList = () => {
    let users = this.state.users1;
    let q = this.state.q;
    users =
      users &&
      users.length > 0 &&
      users.filter(function (user) {
        return (
          user.label.toLowerCase().indexOf(q) != -1 ||
          user.profile_id.toLowerCase().indexOf(q) != -1
        );
        // return  // returns true or false
      });
    this.setState({ filteredUsers: users });
    if (this.state.q == '') {
      this.setState({ filteredUsers: [] });
    }
  };

  myColor(position) {
    if (this.state.active === position) {
      return '#00a891';
    }
    return '';
  }

  color(position) {
    if (this.state.active === position) {
      return 'white';
    }
    return '';
  }

  //User list will be show/hide
  toggle = () => {
    this.setState({
      shown: !this.state.shown,
    });
  };

  //Select the patient name
  updateEntryState2 = (user) => {
    var user1 =
      this.state.users?.length > 0 &&
      this.state.users.filter((data) => data.patient_id === user.value);
    if (user1 && user1.length > 0) {
      const state = this.state.newTask;
      state['patient'] = user1[0];
      state['patient_id'] = user1[0].patient_id;
      state['case_id'] = user1[0].case_id;
      this.setState({ newTask: state });
    }
  };

  onFieldChange2 = (e) => {
    this.setState({
      selectWard: '',
      selectRoom: '',
      wardList: [],
      roomList: [],
    });
    let specialityList =
      this.props &&
      this.props.speciality &&
      this.props.speciality.SPECIALITY.filter((item) => {
        return item && item._id == e.value;
      });
    let wardsFullData =
      specialityList && specialityList.length > 0 && specialityList[0].wards;
    let wards_data =
      wardsFullData &&
      wardsFullData.length > 0 &&
      wardsFullData.map((item) => {
        return { label: item.ward_name, value: item._id };
      });
    this.setState({
      selectSpec2: e,
      wardList: wards_data,
      allWards: wardsFullData,
    });

    // if (e && e.length > 0) {

    //   var specsMap = this.props.speciality && this.props.speciality?.SPECIALITY?.length > 0 && this.props.speciality?.SPECIALITY.map((item) => {

    //     if (item && item.length > 0) { }
    //     let data = item && item.wards && item.wards.length > 0 && item.wards.map((item) => {
    //       return item._id;
    //     })
    //     return { specialty_name: item.specialty_name, _id: item._id, ward_id: data };
    //   })
    //   this.setState({ Allspeciality: specsMap })

    // }
  };

  updatesQuotes = (data) => {
    var steps = getSteps(
      this.props?.House?.value,
      this.props.stateLoginValueAim.token
    );
    steps.then((data) => {
      var stepData = data ? data : [];
      this.setDta(stepData);
    });
  }
  //ward field data
  onWardChange = (e) => {
    this.setState({ selectRoom: '' });
    let { allWards } = this.state;
    let wardDetails =
      allWards &&
      allWards.length > 0 &&
      allWards.filter((item) => {
        return item && item._id == e.value;
      });
    let roomsData =
      wardDetails && wardDetails.length > 0 && wardDetails[0].rooms;
    let rooms =
      roomsData &&
      roomsData.length > 0 &&
      roomsData.map((item) => {
        return { label: item.room_name, value: item._id };
      });
    this.setState({ selectWard: e, roomList: rooms });
  };

  //room field data
  onRoomChange = (e) => {
    this.setState({ selectRoom: e });
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Submit,
      go_to_check,
      go_to_scanner,
      go_to_check_with_email,
      Go_to_check_with_basic,
      go_back_to_check_with_email,
      go_back,
      PatientFlow,
      AddPatienttoFlow,
      PatientID,
      PatientPIN,
      CaseNumber,
      StepNumber,
      filters,
      Patient,
      Staff,
      speciality,
      FilterbyStaff,
      FilterbySpeciality,
      FilterbyWard,
      FilterbyRoom,
      Ward,
      Room,
      id_and_pin_not_correct,
      step_name,
      add_patient_to_flow,
      add_step,
      Add,
      AddPatient,
      AddStep,
      clear_all_filters,
      applyFilters,
      AllSpecialities,
      SelectStepName,
      case_already_exists_in_hospital,
      case_already_exists_in_other_hospital,
      ofInstitution,
      CreateNewPatient,
      Name,
      search_by_patient_id_name_doc,
      Search_Select,
      First_name,
      Birthday,
      Mobile_number,
      Last_name,
      Patient_Email,
      Patient_not_found_information,
    } = translate;

    const {
      searchValue,
      specialitiesList,
      selectedOption,
      StepNameList,
      SelectedStep,
      filteredData,
    } = this.state;
    const userList =
      this.state.filteredUsers &&
      this.state.filteredUsers.map((user) => {
        return (
          <li
            key={user.id}
            style={{
              background: this.myColor(user.id),
              color: this.color(user.id),
            }}
            value={user.profile_id}
            onClick={() => {
              this.setState({ q: user.label, selectedUser: user });
              this.updateEntryState2(user);
              this.toggle(user.id);
              this.setState({ filteredUsers: [] });
            }}
          >
            {user.label} ( {user.profile_id} )
          </li>
        );
      });
    const { House: { roles = [] } = {} } = this.props || {}
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
          <Grid container direction="row">
            <Grid item xs={12} md={12}>
              <LeftMenuMobile isNotShow={true} currentPage="flow" />
              <Grid container direction="row" className="flowContentAdd">
                {/* Start of Menu */}
                <Grid item xs={12} md={1} className="MenuLeftUpr">
                  <LeftMenu isNotShow={true} currentPage="flow" />
                </Grid>
                {/* End of Menu */}
                <Grid item xs={11} md={11}>
                  <Grid className="cmnLftSpc ptntFlowSpc">
                    <Grid className="addFlow">
                      <Grid container direction="row" justify="center">
                        <Grid item xs={12} sm={4} md={4}>
                          <h1>{PatientFlow}</h1>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={8}
                          md={8}
                          className="addFlowRght addFlowBtnSec"
                        >
                          {roles.includes("add_user") &&

                            <a onClick={() => this.newPatient()}>
                              {CreateNewPatient}
                            </a>
                          }
                          {roles.includes("add_patient") &&

                            <a onClick={() => this.openAddPatient()}>
                              {AddPatient}
                            </a>
                          }
                          {roles.includes("add_step") &&

                            <a
                              onClick={() => {
                                this.AddStep();
                              }}
                            >
                              {AddStep}
                            </a>
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid className="srchPatient">
                      <Grid container direction="row" justify="center">
                        <Grid item xs={12} md={5} className="srchLft">
                          <Input
                            name="searchValue"
                            value={searchValue}
                            placeholder={search_by_patient_id_name_doc}
                            onChange={this.handleSearch}
                          />
                          <a>
                            <img
                              src={require('assets/virtual_images/InputField.svg')}
                              alt=""
                              title=""
                            />
                          </a>
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <Grid className="srchRght">
                            <label
                              className="filtersec"
                              onClick={this.clearFilter}
                            >
                              {clear_all_filters}
                            </label>
                            <a
                              className={`${filteredData} flowfilter`}
                              onClick={this.handleOpenFil}
                            >
                              <img
                                src={
                                  filteredData === 'filterApply'
                                    ? require('assets/virtual_images/sort-active.png')
                                    : require('assets/virtual_images/sort.png')
                                }
                                alt=""
                                title=""
                              />
                            </a>
                            <Modal
                              open={this.state.openFil}
                              onClose={this.handleCloseFil}
                            >
                              <Grid
                                className={
                                  this.props.settings &&
                                    this.props.settings.setting &&
                                    this.props.settings.setting.mode &&
                                    this.props.settings.setting.mode === 'dark'
                                    ? 'nwEntrCntnt fltrClear darkTheme'
                                    : 'nwEntrCntnt fltrClear'
                                }
                              >
                                <Grid className="fltrClearIner">
                                  <Grid className="fltrLbl">
                                    <Grid container direction="row" justify="center">
                                      <Grid item xs={8} md={8} lg={8}>
                                        <label>{filters}</label>
                                      </Grid>
                                      <Grid item xs={4} md={4} lg={4}>
                                        <Grid>
                                          <Grid className="entryCloseBtn">
                                            <a onClick={this.handleCloseFil}>
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

                                  <Grid className="fltrForm">
                                    <Grid className="fltrInput">
                                      <label>{Patient}</label>

                                      <Grid>
                                        <Select
                                          name="patient"
                                          options={this.state.users1}
                                          placeholder={Search_Select}
                                          onChange={(e) =>
                                            this.onFieldChange1(e, 'patient')
                                          }
                                          value={this.state.selectedPat || ''}
                                          className="addStafSelect"
                                          isMulti={true}
                                          isSearchable={true}
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid className="fltrInput">
                                      <label>{Staff}</label>
                                      <Grid className="addInput">
                                        <Select
                                          name="professional"
                                          value={this.state.assignedTo2}
                                          options={
                                            this.state.professional_id_list
                                          }
                                          placeholder={FilterbyStaff}
                                          isMulti={true}
                                          isSearchable={true}
                                          className="addStafSelect"
                                          onChange={(e) => this.handleStaff(e)}
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid className="fltrInput">
                                      <label>{speciality}</label>
                                      <Grid className="addInput">
                                        <Select
                                          onChange={(e) =>
                                            this.onFieldChange2(e)
                                          }
                                          options={this.state.specialitiesList}
                                          name="specialty_name"
                                          value={this.state.selectSpec2}
                                          placeholder={FilterbySpeciality}
                                          className="addStafSelect"
                                          isSearchable={true}
                                        />
                                      </Grid>
                                    </Grid>
                                    {this.state.wardList &&
                                      this.state.wardList.length > 0 && (
                                        <Grid className="fltrInput">
                                          <label>{Ward}</label>
                                          <Grid className="addInput">
                                            <Select
                                              onChange={(e) =>
                                                this.onWardChange(e)
                                              }
                                              options={this.state.wardList}
                                              name="specialty_name"
                                              value={this.state.selectWard}
                                              placeholder={FilterbyWard}
                                              className="addStafSelect"
                                              isSearchable={true}
                                            />
                                          </Grid>
                                        </Grid>
                                      )}
                                    {this.state.roomList &&
                                      this.state.roomList.length > 0 && (
                                        <Grid className="fltrInput">
                                          <label>{Room}</label>
                                          <Grid className="addInput">
                                            <Select
                                              onChange={(e) =>
                                                this.onRoomChange(e)
                                              }
                                              options={this.state.roomList}
                                              name="specialty_name"
                                              value={this.state.selectRoom}
                                              placeholder={FilterbyRoom}
                                              className="addStafSelect"
                                              isSearchable={true}
                                            />
                                          </Grid>
                                        </Grid>
                                      )}
                                  </Grid>
                                  <Grid className="aplyFltr">
                                    <Grid className="aplyLft">
                                      <label
                                        className="filterCursor"
                                        onClick={this.clearFilter}
                                      >
                                        {clear_all_filters}
                                      </label>
                                    </Grid>
                                    <Grid className="aplyRght">
                                      <Button onClick={this.filterResult}>
                                        {applyFilters}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Modal>

                            <Select
                              value={selectedOption}
                              onChange={this.onChooseSpeciality}
                              options={specialitiesList}
                              placeholder={AllSpecialities}
                              className="allSpec newsec"
                              isSearchable={false}
                            />
                            <a
                              className={
                                this.state.view === 'vertical'
                                  ? 'horzSort'
                                  : 'lineSort'
                              }
                              onClick={() => {
                                this.setState({ view: 'vertical' });
                              }}
                            >
                              {/* {this.state.view === 'vertical' ? */}
                              <img
                                src={require('assets/virtual_images/active-vertical.png')}
                                alt=""
                                title=""
                              />
                              {/* :
                                <img
                                  src={require("assets/virtual_images/lines.png")}
                                  alt=""
                                  title=""
                                />} */}
                            </a>
                            <a
                              className={
                                this.state.view === 'horizontal'
                                  ? 'horzSort'
                                  : 'lineSort'
                              }
                              onClick={() => {
                                this.setState({ view: 'horizontal' });
                              }}
                            >
                              {/* {this.state.view === 'horizontal' ? */}

                              <img
                                src={require('assets/virtual_images/active-horizontal.png')}
                                alt=""
                                title=""
                              />
                              {/* : <img
                                  src={require("assets/virtual_images/non-active-horizontal.png")}
                                  alt=""
                                  title=""
                                /> */}
                              {/* } */}
                            </a>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {roles.includes("show_step_patient") &&
                      <div className="custom-d-n-d">
                        <Drags
                          changeStaffsec={this.state.changeStaffsec}
                          updatesQuotes={(data) => { this.updatesQuotes(data) }}
                          moveDetial={(id, case_id) =>
                            this.moveDetial(id, case_id)
                          }
                          DeleteStep={(index) => this.DeleteStep(index)}
                          onKeyDownlogin={this.onKeyDownlogin}
                          editName={this.editName}
                          edit={this.state.edit}
                          onChange={this.onChange}
                          AddStep={this.AddStep}
                          openAddPatient={this.openAddPatient}
                          initial={this.state.fullData}
                          dragDropFlow={this.dragDropFlow}
                          moveAllPatient={(to, from, data) =>
                            this.moveAllPatient(to, from, data)
                          }
                          view={this.state.view}
                          moveStep={(to, from, item) => {
                            this.moveStep(to, from, item);
                          }}
                          setDta={(item) => this.setDta(item)}
                          professional_id_list={this.state.professional_id_list}
                          professionalArray={this.state.professionalArray}
                          updateEntryState3={(e, case_id) => {
                            this.updateEntryState3(e, case_id);
                          }}
                          MovetoTask={(speciality, patient_id) => {
                            this.MovetoTask(speciality, patient_id);
                          }}
                          MovetoService={() => {
                            this.MovetoService();
                          }}
                          mode={this.props?.settings?.setting?.mode}
                          // socket={()=>SocketIo()}
                          stateLanguageType={this.props.stateLanguageType}
                          roles={roles}
                        />
                      </div>}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Modal
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          open={this.state.openAddP}
          onClose={this.closeAddP}
        >
          <Grid
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === 'dark'
                ? 'addFlowContnt darkTheme'
                : 'addFlowContnt'
            }
          >
            <Grid className="addFlowIner">
              <Grid className="addFlowLbl">
                <Grid container direction="row" justify="center">
                  <Grid item xs={8} md={8} lg={8}>
                    <label>{AddPatienttoFlow}</label>
                  </Grid>
                  <Grid item xs={4} md={4} lg={4}>
                    <Grid>
                      <Grid className="entryCloseBtn">
                        <a onClick={this.closeAddP}>
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
              <Grid className="patentInfo">
                {this.state.enableEmail == 'email' && (
                  <Grid className="patentInfoBtn pateintInfoUser">
                    <VHfield
                      label={Patient_Email}
                      name="email"
                      onChange={(e) => this.updateEntryState1(e, 'email')}
                      value={this.state.updateState?.email || ''}
                    />
                    <ul className="addpatientoption">
                      <li onClick={() => this.handleEnableEmail('scan')}>
                        {go_back}
                      </li>
                      <li onClick={() => this.handleEnableEmail('other')}>
                        {go_to_check}
                      </li>
                    </ul>
                  </Grid>
                )}
                {this.state.enableEmail == 'scan' && (
                  <Grid className="patentInfoBtn pateintInfoUser">
                    <p>{this.state.msgState}</p>
                    {this.state.enableScan == true ? (
                      <QrReader
                        delay={300}
                        onError={this.handleError}
                        onScan={(e) => this.handleScan(e, 'patient_id')}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      <ul className="addpatientoption">
                        <li
                          onClick={() =>
                            this.setState({ enableScan: true, msgState: '' })
                          }
                        >
                          {go_to_scanner}
                        </li>
                      </ul>
                    )}
                    <ul className="addpatientoption">
                      <li onClick={() => this.handleEnableEmail('email')}>
                        {go_to_check_with_email}
                      </li>
                      <li onClick={() => this.handleEnableEmail('other')}>
                        {Go_to_check_with_basic}
                      </li>
                    </ul>
                  </Grid>
                )}
                {this.state.enableEmail == 'other' && (
                  <Grid>
                    <Grid className="patentInfoTxt">
                      <VHfield
                        label={First_name}
                        name="first_name"
                        onChange={(e) =>
                          this.updateEntryState1(e, 'first_name')
                        }
                        value={this.state.updateState?.first_name || ''}
                      />
                    </Grid>
                    <Grid className="patentInfoTxt">
                      <VHfield
                        label={Last_name}
                        name="last_name"
                        value={this.state.updateState?.last_name || ''}
                        onChange={(e) => this.updateEntryState1(e, 'last_name')}
                      />
                    </Grid>

                    <Grid className="profileInfoDate">
                      <Grid className="dateFormateSec">
                        <Grid>
                          <label>{Birthday}</label>
                        </Grid>
                        <DateFormat
                          name="birthday"
                          value={
                            this.state.updateState &&
                              this.state.updateState?.birthday
                              ? new Date(this.state.updateState?.birthday)
                              : new Date()
                          }
                          date_format={
                            this.props.settings &&
                            this.props.settings.setting &&
                            this.props.settings.setting.date_format
                          }
                          onChange={(value) =>
                            this.updateEntryState1(value, 'birthday')
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* <Grid className="fillDia">
                      <Grid className="rrSysto dateFormateSec">
                        <Grid>
                          <label>Birthday</label>
                        </Grid>


                        <DateFormat
                          name="birthday"
                          value={this.state.updateState.birthday ? new Date(this.state.updateState?.birthday) : new Date()}
                          // notFullBorder
                          date_format={
                            this.props.settings &&
                            this.props.settings.setting &&
                            this.props.settings.setting.date_format
                          }
                          onChange={(e) => this.updateEntryState1(e, "birthday")}
                          customStyles={{ dateInput: { borderWidth: 0 } }}
                        />

                      </Grid>
                    </Grid> */}
                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={12}>
                          <label>{Mobile_number}</label>
                          <Grid className="setPositionMob">
                            {this.updateFLAG(this.state.updateState.mobile) &&
                              this.updateFLAG(this.state.updateState.mobile) !==
                              '' && (
                                <ReactFlagsSelect
                                  searchable={true}
                                  onSelect={(e) => {
                                    this.updateFlags(e, 'flag_mobile');
                                  }}
                                  name="flag_mobile"
                                  showSelectedLabel={false}
                                  defaultCountry={this.updateFLAG(
                                    this.state.updateState.mobile
                                  )}
                                />
                              )}
                            <input
                              type="text"
                              className="Mobile_extra"
                              name="mobile"
                              onChange={this.updateEntryState8}
                              value={
                                (this.state.updateState.mobile &&
                                  this.updateMOBILE(
                                    this.state.updateState.mobile
                                  )) ||
                                ''
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}></Grid>
                        <Grid className="clear"></Grid>
                      </Grid>
                    </Grid>
                    <ul className="addpatientoption">
                      <li onClick={() => this.handleEnableEmail('email')}>
                        {go_back_to_check_with_email}
                      </li>
                      <li onClick={() => this.handleEnableEmail('scan')}>
                        {go_back}
                      </li>
                    </ul>
                  </Grid>
                )}
                <Grid className="patentInfoTxt">
                  <VHfield
                    label={CaseNumber}
                    name="case_number"
                    value={this.state.case.case_number}
                    onChange={this.onChangeCase}
                  />
                </Grid>
                <label>{step_name}</label>
                <Grid className="patentInfoTxt">
                  <Select
                    value={SelectedStep}
                    onChange={this.onSelectingStep}
                    options={StepNameList}
                    placeholder={SelectStepName}
                    className="allSpeces"
                    isSearchable={false}
                  />
                </Grid>
              </Grid>
              <Grid className="patentInfoBtn patentTnfoBtn1">
                {this.state.caseAlready && (
                  <div className="err_message">
                    {case_already_exists_in_hospital}
                  </div>
                )}
                {this.state.inOtherAlready && (
                  <div className="err_message">
                    {case_already_exists_in_other_hospital}{' '}
                    <b>{this.state.alreadyData?.house?.house_name}</b>{' '}
                    {ofInstitution}
                    <b>
                      {this.state.alreadyData?.institute_groups?.group_name}
                    </b>
                  </div>
                )}
                {this.state.idpinerror && (
                  <div className="err_message">
                    {Patient_not_found_information}
                  </div>
                )}
                <p className="err_message">{this.state.errorMsg}</p>
                <Button onClick={this.AddCase}>{Submit}</Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>

        {/* +add step pop-up */}
        <Modal
          open={this.state.openPopup}
          onClose={this.handleClosePopup}
          className={
            this.props.settings &&
              this.props.settings.setting &&
              this.props.settings.setting.mode &&
              this.props.settings.setting.mode === 'dark'
              ? 'darkTheme addWrnModel'
              : 'addWrnModel'
          }
        >
          <Grid className="addWrnContnt">
            <Grid className="addWrnIner">
              <Grid className="addWrnLbl">
                <Grid className="headingFormat">
                  <Grid container direction="row" justify="center">
                    <Grid item xs={8} md={8} lg={8}>
                      <label>{add_step}</label>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <Grid>
                        <Grid className="entryCloseBtn">
                          <a onClick={this.handleClosePopup}>
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
              <Grid className="enterWrnUpr">
                <Grid className="enterWrnMain">
                  <p className="err_message">{this.state.stepError}</p>
                  <Grid className="buttonStyle fltrInput">
                    <input
                      name={'Step' + new Date().getTime()}
                      className="step_name"
                      placeholder={Name}
                      value={this.state.step_name}
                      onChange={this.handleName}
                      type="text"
                    />
                    <a color="primary" onClick={this.OnAdd}>
                      {Add}
                    </a>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
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