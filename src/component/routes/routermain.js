import React, { Component } from "react";
import { Route, BrowserRouter as Router, Switch, StaticRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LoginReducerAim } from 'Screens/Login/actions';
// Added By Ankita Patient Component
import Register from "Screens/Register";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction";
import Login from "Screens/Login";
import ForgotPass from "Screens/ChangePassword";
import ChangePass from "Screens/ChangePassword/changepassword";
import NotFound from "Screens/Components/NotFound";
import PatientProfile from "Screens/Patient/Profile/index";
import PatientSecond from "Screens/Patient/More/secondopinion";
import PatientEmergency from "Screens/Patient/More/EmergencyPatientData";
import PatientExtra from "Screens/Patient/More/ExtraServices";
import PatientDocument from "Screens/Patient/MyDocuments/index";
import PatientOnline from "Screens/Patient/More/OnineCoure";
import PaitnetViewCourses from "Screens/Patient/More/viewCourses";
import PatientTracker from "Screens/Patient/Tracker/tracker";
import PatientTimeLine from "Screens/Patient/Journal/index";
import PatientChats from "Screens/Patient/Chat/index";
import Patientjourney from "Screens/Patient/Patientjourney/index.js";
import PatientTimeLine1 from "Screens/ViewTimelineComponent/index.js";
import PatientBlockchain from "Screens/Patient/More/blockchain.js";
import PatientarchiveJournal from "Screens/Patient/More/archiveJournal.js";
import Appointment from "Screens/Patient/Appointment/index";
import RegSuccuss from "Screens/Components/RegSuccess/index";

//Paramedic Component
import ParamedicEmergency from "Screens/Paramedic/EmergencySection";
import ParamedicProfile from "Screens/Paramedic/Profile/index";
import ParamedicOnline from "Screens/Paramedic/onlineCourse/index";
import ParamedicChats from "Screens/Paramedic/Chat/index";

//Insurance Component
import InsuranceEmergency from "Screens/Insurance/EmergencySection";
import InsuranceProfile from "Screens/Insurance/Profile/index";
import InsuranceOnline from "Screens/Insurance/onlineCourse/index";
import InsuranceChats from "Screens/Insurance/Chat/index";

//Nurse Component
import NurseEmergency from "Screens/Nurse/Emergency";
import NurseProfile from "Screens/Nurse/Profile/index";
import NurseOnline from "Screens/Nurse/onlineCourse/index";
import NurseJournal from "Screens/Nurse/Journal/index";
import NurseChats from "Screens/Nurse/Chat/index";

//Pharmacy Component
import PharmaEmergency from "Screens/Pharmacy/Emergency";
import PharmaProfile from "Screens/Pharmacy/Profile/index";
import PharmaOnline from "Screens/Pharmacy/onlineCourse/index";
import PharmaPrescription from "Screens/Pharmacy/Prescriptions/index";
import PharmaChats from "Screens/Pharmacy/Chat/index";
import PharmaArchive from "Screens/Pharmacy/Archive/index";
import PharmaPrescEmergency from "Screens/Pharmacy/Journal/index";

//Doctor Component
import DoctorService from "Screens/Doctor/Services/index.js";
import MyDocument from "Screens/Doctor/Inquiries/index.js";
import Myprofile from "Screens/Doctor/Profile/index.js";
import DoctorAppointment from "Screens/Doctor/Appointment/index.js";

import DoctorChats from "Screens/Doctor/Chat/index.js";
import DoctorEmergency from "Screens/Doctor/Emergency/index.js";
import DoctorOnline from "Screens/Doctor/onlineCourse/index.js";
import DoctorJournal from "Screens/Doctor/Journal/index.js";
import DoctorProfessionalTask from "Screens/Doctor/ProfessionalActivity/index.js";
import DicomView from "Screens/Components/DicomView/ImageViewer";
// import DoctorProfessionalActivity from "Screens/Doctor/ProfessionalActivity/index.js";
import DoctorET from "Screens/Doctor/Earlier_Activities/index.js";

//for hospital admin user
import H_patient from "Screens/hospital_Admin/h_patient";
import H_doctor from "Screens/hospital_Admin/h_doctors";
import H_nurse from "Screens/hospital_Admin/h_nurse";
import H_archive from "Screens/hospital_Admin/hadmin_archivechoose";
import H_document from "Screens/hospital_Admin/h_Documents";
import H_profile from "Screens/hospital_Admin/h_adminProfile";
// import CallatAllPages from "Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/CallatAllPages";
import H_Group from "Screens/hospital_Admin/h_add_group";
import H_Staff from "Screens/hospital_Admin/h_staffs";

//virtualhospital
import VHStatistics from "Screens/VirtualHospital/Statistics/index";
import VHPatientFlow from "Screens/VirtualHospital/PatientFlow/index";
import VHSpaceManagement from "Screens/VirtualHospital/SpaceManagement/index.js";
import VHExterSpaceManagement from "Screens/VirtualHospital/ExternalSpaceManage/index.js";
import VHSpecialityView from "Screens/VirtualHospital/MobileRoomsBedSpecialities/index";
import VHBills from "Screens/VirtualHospital/Bills/index";
import VHTasks from "Screens/VirtualHospital/Tasks/index";
import VHInvoices from "Screens/VirtualHospital/Invoices/index";
import VHServices from "Screens/VirtualHospital/Services/index";
import VHAppointTask from "Screens/VirtualHospital/AppointTask/index";
import RoomFlow from "Screens/VirtualHospital/SpaceManagement/RoomFlow";
import Questionnaire from "Screens/VirtualHospital/Questionnaire";
import ManageBeds from "Screens/VirtualHospital/SpaceManagement/manageBeds";
import VHInstitutes from "Screens/VirtualHospital/Institutes/index";
import PatientDetail from "Screens/VirtualHospital/PatientDetails/index";
import UploadApproval from "Screens/VirtualHospital/UploadApproval/index";
// import AssignModelTask from "Screens/VirtualHospital/Tasks/AssignModelTask.js";
import VHProfile from "Screens/VirtualHospital/Profile/index";
import AddPatient from "Screens/VirtualHospital/AddPatient/index";
import InvoicePattern from "Screens/VirtualHospital/InvoicePattern/index.js";
import StaffGroup from "Screens/VirtualHospital/StaffGroup/index.js";
import AssignTherapy from "Screens/VirtualHospital/AssignTherapy/index.js";
import UplaodDocument from "Screens/VirtualHospital/UploadDocument/index.js";
import DoctorInstitute from "Screens/Doctor/institites/index";
import NurseInstitute from "Screens/Nurse/institutes/index";
// import NursePA from "Screens/Nurse/ProfessionalActivity/index";
import NursePT from "Screens/Nurse/ProfessionalTask/index";
import NurseET from "Screens/Nurse/Earlier_Activity/index";
import NurseAppointment from "Screens/Nurse/Appointment/index.js";
import ApproveHospital from "Screens/Components/ApprovalHospital/index";
import CareQuestionary from "Screens/Nurse/CareQuestionary";
import DoctorCareQuestionnary from "Screens/Doctor/CareQuestionary";
import VHAssignedServices from "Screens/VirtualHospital/AssignedServices/index.js";
import QuestionShow from "Screens/VirtualHospital/QuestionShow/index.js";
import AccessKeyLog from "../../Screens/Doctor/AccessKeyLog/index";
import VideoCall from "../../Screens/Doctor/AccessKeyLog/VideoCall/index"
// import io from "socket.io-client";
// import { GetSocketUrl } from "Screens/Components/BasicMethod/index";
import TryCaptcha from "Screens/TryCaptch"
import {SocketIo, clearScoket} from "socket";
// const SOCKET_URL = GetSocketUrl()

// var socket = io(SOCKET_URL);
class Routermain extends Component {

  allHouses = () => {
    var socket = SocketIo();
    var data = this.props.stateLoginValueAim?.user?.type
    if (data == "nurse") {
      socket.on("displaynurse", (data) => {
        this.setData(data)
      })
      socket.on("deletedataN", (data) => {
        this.setData(data)
      })
      socket.on("UpdateddataN", (data) => {
        this.setData(data)
      })

    } else if (data == 'doctor') {
      socket.on("displaydoctor", (data) => {
        this.setData(data)
      })
      socket.on("deletedata", (data) => {
        this.setData(data)
      })
      socket.on("Updateddata", (data) => {
        this.setData(data)
      })
    } else if (data == 'adminstaff') {
      socket.on("displayadmin", (data) => {
        this.setData(data, 'adminstaff')
      })
      socket.on("deletedataA", (data) => {
        this.setData(data, 'adminstaff')
      })
      socket.on("UpdateddataA", (data) => {
        this.setData(data, 'adminstaff')
      })
    }

  };

  setData = (data) => {
    if (this.props.stateLoginValueAim?.user?._id === data?._id) {
      let user_token = this.props.stateLoginValueAim.token;
      let user = this.props.stateLoginValueAim?.user;
      user['houses'] = data?.houses;
      var forUpdate = { value: true, token: user_token, user: user }
      this.props.LoginReducerAim(data?.email, '', user_token, () => { }, forUpdate);
      if (user && user.type === 'adminstaff') {
        var filterHouse = data?.houses?.length > 0 && data?.houses?.filter((data) => data?.value === this.props?.House?.value)
        if (filterHouse && filterHouse?.length > 0) {
          this.props.houseSelect(filterHouse[0], true);
        }

      }
    }
  }

  componentDidMount() {
      this.allHouses();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.stateLoginValueAim !== this.props.stateLoginValueAim) {
        this.allHouses();
    }
  };

  render() {
    return (
      <Router basename={"/"}>
        {/* <CallatAllPages /> */}
        <Grid>
          <Switch>
            {/* Added by Ankita */}
            <Route exact path="/" render={(props) => <Login {...props} />} />
            <Route
              exact
              path="/try"
              render={(props) => <TryCaptcha {...props} />}
            />
            <Route
              exact
              path="/register"
              render={(props) => <Register {...props} />}
            />
            <Route
              exact
              path="/forgot-password"
              render={(props) => <ForgotPass {...props} />}
            />
            <Route
              exact
              path="/change-password"
              render={(props) => <ChangePass {...props} />}
            />
            <Route
              exact
              path="/patient"
              render={(props) => <PatientProfile {...props} />}
            />
            <Route
              exact
              path="/patient/appointment"
              render={(props) => <Appointment {...props} />}
            />
            <Route
              exact
              path="/patient/second-opinion"
              render={(props) => <PatientSecond {...props} />}
            />
            <Route
              exact
              path="/patient/emergency"
              render={(props) => <PatientEmergency {...props} />}
            />
            <Route
              exact
              path="/patient/extra-services"
              render={(props) => <PatientExtra {...props} />}
            />
            <Route
              exact
              path="/patient/documents"
              render={(props) => <PatientDocument {...props} />}
            />
            <Route
              exact
              path="/patient/patient-journey"
              render={(props) => <Patientjourney {...props} />}
            />
            <Route
              exact
              path="/patient/online-course"
              render={(props) => <PatientOnline {...props} />}
            />
            <Route
              exact
              path="/patient/view-course"
              render={(props) => <PaitnetViewCourses {...props} />}
            />
            <Route
              exact
              path="/patient/tracker"
              render={(props) => <PatientTracker {...props} />}
            />
            <Route
              exact
              path="/patient/journal"
              render={(props) => <PatientTimeLine {...props} />}
            />
            <Route
              exact
              path="/patient/Timelinecomponents"
              render={(props) => <PatientTimeLine1 {...props} />}
            />
            {/* <Route
              exact
              path="/patient/chats"
              render={(props) => <PatientChats {...props} />}
            /> */}
            <Route
              exact
              path="/patient/blockchain"
              render={(props) => <PatientBlockchain {...props} />}
            />
            <Route
              exact
              path="/patient/archiveJournal"
              render={(props) => <PatientarchiveJournal {...props} />}
            />

            <Route
              exact
              path="/paramedic"
              render={(props) => <ParamedicEmergency {...props} />}
            />
            <Route
              exact
              path="/paramedic/profile"
              render={(props) => <ParamedicProfile {...props} />}
            />
            {/* <Route
              exact
              path="/paramedic/chats"
              render={(props) => <ParamedicChats {...props} />}
            /> */}
            <Route
              exact
              path="/paramedic/online-course"
              render={(props) => <ParamedicOnline {...props} />}
            />
            <Route
              exact
              path="/paramedic/view-course"
              render={(props) => <PaitnetViewCourses {...props} />}
            />

            <Route
              exact
              path="/insurance"
              render={(props) => <InsuranceEmergency {...props} />}
            />
            <Route
              exact
              path="/insurance/profile"
              render={(props) => <InsuranceProfile {...props} />}
            />
            {/* <Route
              exact
              path="/insurance/chats"
              render={(props) => <InsuranceChats {...props} />}
            /> */}
            <Route
              exact
              path="/insurance/online-course"
              render={(props) => <InsuranceOnline {...props} />}
            />
            <Route
              exact
              path="/insurance/view-course"
              render={(props) => <PaitnetViewCourses {...props} />}
            />

            {/* <Route
              exact
              path="/nurse"
              render={(props) => <NurseChats {...props} />}
            /> */}
            <Route
              exact
              path="/nurse/profile"
              render={(props) => <NurseProfile {...props} />}
            />
            <Route
              exact
              path="/nurse/emergency"
              render={(props) => <NurseEmergency {...props} />}
            />
            <Route
              exact
              path="/nurse/journal"
              render={(props) => <NurseJournal {...props} />}
            />
            <Route
              exact
              path="/nurse/online-course"
              render={(props) => <NurseOnline {...props} />}
            />
            <Route
              exact
              path="/nurse/view-course"
              render={(props) => <PaitnetViewCourses {...props} />}
            />

            {/* <Route
              exact
              path="/pharmacy"
              render={(props) => <PharmaChats {...props} />}
            /> */}
            <Route
              exact
              path="/pharmacy/profile"
              render={(props) => <PharmaProfile {...props} />}
            />
            <Route
              exact
              path="/pharmacy/emergency"
              render={(props) => <PharmaEmergency {...props} />}
            />
            <Route
              exact
              path="/pharmacy/prescriptions"
              render={(props) => <PharmaPrescription {...props} />}
            />
            <Route
              exact
              path="/pharmacy/prescription-emergency"
              render={(props) => <PharmaPrescEmergency {...props} />}
            />
            <Route
              exact
              path="/pharmacy/online-course"
              render={(props) => <PharmaOnline {...props} />}
            />
            <Route
              exact
              path="/pharmacy/view-course"
              render={(props) => <PaitnetViewCourses {...props} />}
            />
            <Route
              exact
              path="/pharmacy/prescription-archive"
              render={(props) => <PharmaArchive {...props} />}
            />

            {/* Doctor Router Start*/}
            <Route
              exact
              path="/doctor"
              render={(props) => <DoctorService {...props} />}
            />
            <Route
              exact
              path="/doctor/patient"
              render={(props) => <DoctorService {...props} />}
            />
            <Route
              exact
              path="/doctor/inquiries"
              render={(props) => <MyDocument {...props} />}
            />
            <Route
              exact
              path="/doctor/profile"
              render={(props) => <Myprofile {...props} />}
            />
            <Route
              exact
              path="/doctor/appointment"
              render={(props) => <DoctorAppointment {...props} />}
            />



            {/* Added by ankita */}
            <Route
              exact
              path="/nurse/appointment"
              render={(props) => <NurseAppointment {...props} />}
            />
            <Route
              exact
              path="/doctor/emergency"
              render={(props) => <DoctorEmergency {...props} />}
            />
            <Route
              exact
              path="/doctor/online-course"
              render={(props) => <DoctorOnline {...props} />}
            />
            <Route
              exact
              path="/doctor/view-course"
              render={(props) => <PaitnetViewCourses {...props} />}
            />
            {/* <Route
              exact
              path="/doctor/chats"
              render={(props) => <DoctorChats {...props} />}
            /> */}
            <Route
              exact
              path="/doctor/journal"
              render={(props) => <DoctorJournal {...props} />}
            />
            <Route
              exact
              path="/doctor/professional-activity"
              render={(props) => <DoctorProfessionalTask {...props} />}
            />
            {/* <Route
              exact
              path="/doctor/professional-activity"
              render={(props) => <DoctorProfessionalActivity {...props} />}

            /> */}
            <Route

              exact
              path="/doctor/video-call"
              render={(props) => <VideoCall {...props} />}
            />

            <Route
              exact
              path="/doctor/access-key"
              render={(props) => <AccessKeyLog {...props} />}
            />
            <Route
              exact
              path="/doctor/care-questionary"
              render={(props) => <DoctorCareQuestionnary {...props} />}
            />
            <Route
              path="/doctor/earlier-task"
              exact={true}
              render={(props) => <DoctorET {...props} />}
            />

            {/* Doctor Router End*/}
            <Route
              exact
              path="/register-successfull"
              render={(props) => <RegSuccuss {...props} />}
            />
            <Route
              exact
              path="/Dicom-file-view"
              render={(props) => <DicomView {...props} />}
            />
            {/* Add for hospital */}
            <Route
              exact={true}
              path="/h-patients"
              render={(props) => <H_patient {...props} />}
            />
            <Route
              exact={true}
              path="/h-doctors"
              render={(props) => <H_doctor {...props} />}
            />
            <Route
              exact={true}
              path="/h-nurses"
              render={(props) => <H_nurse {...props} />}
            />
            <Route
              exact={true}
              path="/h-archivechoose"
              render={(props) => <H_archive {...props} />}
            />
            <Route
              exact={true}
              path="/h-documents"
              render={(props) => <H_document {...props} />}
            />
            <Route
              exact={true}
              path="/h-profile"
              render={(props) => <H_profile {...props} />}
            />
            <Route
              exact={true}
              path="/h-staff"
              render={(props) => <H_Staff {...props} />}
            />

            <Route
              exact={true}
              path="/h-groups"
              render={(props) => <H_Group {...props} />}
            />

            {/*   Virtualhospital page */}

            <Route
              path="/virtualhospital/statistics"
              exact={true}
              render={(props) => <VHStatistics {...props} />}
            />
            <Route
              path="/virtualhospital/patient-flow"
              exact={true}
              render={(props) => <VHPatientFlow {...props} />}
            />
            <Route
              path="/virtualhospital/speciality"
              exact={true}
              render={(props) => <VHSpecialityView {...props} />}
            />
            <Route
              path="/virtualhospital/bills"
              exact={true}
              render={(props) => <VHBills {...props} />}
            />
            <Route
              path="/virtualhospital/tasks"
              exact={true}
              render={(props) => <VHTasks {...props} />}
            />

            <Route
              path="/virtualhospital/assignedservices"
              exact={true}
              render={(props) => <VHAssignedServices {...props} />}
            />

            <Route
              path="/virtualhospital/invoices"
              exact={true}
              render={(props) => <VHInvoices {...props} />}
            />
            <Route
              path="/virtualhospital/external-space"
              exact={true}
              render={(props) => <VHExterSpaceManagement {...props} />}
            />
            <Route
              path="/virtualhospital/carequestionnary-submit"
              exact={true}
              render={(props) => <QuestionShow {...props} />}
            />
            <Route
              path="/virtualhospital/services"
              exact={true}
              render={(props) => <VHServices {...props} />}
            />
            <Route
              path="/virtualhospital/profile"
              exact={true}
              render={(props) => <VHProfile {...props} />}
            />
            <Route
              path="/virtualhospital/calendar"
              exact={true}
              render={(props) => <VHAppointTask {...props} />}
            />
            <Route
              path="/virtualhospital/manage-beds"
              exact={true}
              render={(props) => <ManageBeds {...props} />}
            />
            <Route
              path="/virtualhospital/institutes"
              exact={true}
              render={(props) => <VHInstitutes {...props} />}
            />

            {/* Adding by Ankit */}

            <Route
              path="/virtualhospital/space"
              exact={true}
              render={(props) => <VHSpaceManagement {...props} />}
            />
            <Route
              path="/virtualhospital/room-flow"
              exact={true}
              render={(props) => <RoomFlow {...props} />}
            />
            <Route
              path="/virtualhospital/questionnaire"
              exact={true}
              render={(props) => <Questionnaire {...props} />}
            />
            <Route
              path="/virtualHospital/patient-detail/:id/:case_id"
              exact={true}
              render={(props) => <PatientDetail {...props} />}
            />
            <Route
              path="/virtualHospital/new-user"
              exact={true}
              render={(props) => <AddPatient {...props} />}
            />
            {/* Add By tanya*/}
            <Route
              path="/virtualHospital/invoice_pattern"
              exact={true}
              render={(props) => <InvoicePattern {...props} />}
            />
            <Route
              path="/virtualHospital/staff-group"
              exact={true}
              render={(props) => <StaffGroup {...props} />}
            />
            <Route
              path="/virtualHospital/add-therapy"
              exact={true}
              render={(props) => <AssignTherapy {...props} />}
            />

            <Route
              path="/virtualHospital/print_approval"
              exact={true}
              render={(props) => <UplaodDocument {...props} />}
            />
            <Route
              path="/virtualHospital/approved_add"
              exact={true}
              render={(props) => <UploadApproval {...props} />}
            />

            <Route
              path="/doctor/institutes"
              exact={true}
              render={(props) => <DoctorInstitute {...props} />}
            />
            {/* NEW ADDED AT NURSE End */}
            <Route
              path="/nurse/care-questionary"
              exact={true}
              render={(props) => <CareQuestionary {...props} />}
            />
            <Route
              path="/nurse/institutes"
              exact={true}
              render={(props) => <NurseInstitute {...props} />}
            />
            <Route
              path="/nurse/professional-activity"
              exact={true}
              render={(props) => <NursePT {...props} />}
            />
            {/* <Route
              path="/nurse/professional-task"
              exact={true}
              render={(props) => <NursePT {...props} />}
            /> */}
            <Route
              path="/nurse/earlier-task"
              exact={true}
              render={(props) => <NurseET {...props} />}
            />

            <Route
              path="/approveHospital/:id/:house_id"
              exact={true}
              render={(props) => <ApproveHospital {...props} />}
            />

            {/* <Route
              path="/virtualhospital/assign"
              exact={true}
              render={(props) => <AssignModelTask {...props} />}
            /> */}
            <Route
              path="*"
              exact={true}
              render={(props) => <NotFound {...props} />}
            />

            {/* End By Ankita */}
          </Switch>
        </Grid>
      </Router>
    );
  }
}
const mapStateToProps = (state) => {
  const { stateLoginValueAim } =
    state.LoginReducerAim;
  const { House } = state.houseSelect;
  return {
    stateLoginValueAim,
    House,
  };
};
export default withRouter(
  connect(mapStateToProps, { LoginReducerAim, houseSelect })(
    Routermain
  )
);
