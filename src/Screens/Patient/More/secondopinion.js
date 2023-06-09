import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import sitedata from "sitedata";
import { LanguageFetchReducer } from "Screens/actions";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import Radio from "@material-ui/core/Radio";
import axios from "axios";
import { Redirect } from "react-router-dom";
import ListingSecond from "./Components/ListingSecond";
import Loader from "Screens/Components/Loader/index";
import LeftMenu from "Screens/Components/Menus/PatientLeftMenu/index";
import LeftMenuMobile from "Screens/Components/Menus/PatientLeftMenu/mobile";
import FileUploader from "Screens/Components/FileUploader/index";
import { AddFavDoc } from "Screens/Components/BasicMethod/index";
import { authy } from "Screens/Login/authy.js";
import { getLanguage } from "translations/index"

// import Notification from "Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications";
import { commonHeader } from "component/CommonHeader/index";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addSec: false,
      specialistOption: null,
      successfullsent: false,
      Pdoctors: [],
      error: false,
      docProfile: false,
      loaderImage: false,
      selectedPdoc: {},
      share_to_doctor: false,
      AddSecond: {},
      err_pdf: false,
      personalinfo: {},
      found: false,
      newItemp: {},
    };
  }

  componentDidMount() {
    this.alldoctor();
    this.patientinfo();
  }

  //Get current User Information
  patientinfo() {
    var user_id = this.props.stateLoginValueAim.user._id;
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + "/UserProfile/Users/" + user_id, commonHeader(user_token))
      .then((response) => {
        this.setState({ personalinfo: response.data.data, loaderImage: false });
      });
  }

  //For save the second opinion
  saveData = () => {
    this.setState({ error: false });
    var data = this.state.AddSecond;
    if (data.doctor_id) {
      this.setState({ error: false });
      this.setState({ loaderImage: true });
      // const user_token = this.props.stateLoginValueAim.token;
      // var data = this.state.AddSecond;
      if (this.state.fileattach) {
        data.documents = this.state.fileattach;
      }
      data.patient_info = {
        patient_id: this.state.personalinfo.profile_id,
        first_name: this.state.personalinfo.first_name,
        last_name: this.state.personalinfo.last_name,
        email: this.state.personalinfo.email,
        birthday: this.state.personalinfo.birthday,
        profile_image: this.state.personalinfo.image,
      };
      data.status = "free";
      data.view_status = "free";
      data.lan = this.props.stateLanguageType;
      data.docProfile = {
        patient_id: this.state.docProfile.profile_id,
        first_name: this.state.docProfile.first_name,
        last_name: this.state.docProfile.last_name,
        email: this.state.docProfile.email,
        birthday: this.state.docProfile.birthday,
        profile_image: this.state.docProfile.image,
      };
      data.send_on = new Date();
      data.patient_id = this.props.stateLoginValueAim.user._id;
      data.patient_email = this.props.stateLoginValueAim.user.email;
      data.first_name = this.state.personalinfo.first_name;
      data.last_name = this.state.personalinfo.last_name;
      data.email = this.props.stateLoginValueAim.user.email;
      data.birthday = this.state.personalinfo.birthday;
      data.profile_image = this.state.personalinfo.image;
      data.patient_profile_id = this.props.stateLoginValueAim.user.profile_id;
      axios
        .post(sitedata.data.path + "/UserProfile/second_opinion", data)
        .then((responce) => {
          if (this.state.share_to_doctor) {
            AddFavDoc(
              this.state.docProfile.profile_id,
              this.state.docProfile.profile_id,
              this.props.stateLoginValueAim.token,
              this.props.stateLoginValueAim.user.profile_id
            );
          }
          this.setState({
            fileattach: {},
            selectedPdoc: {},
            newItemp: data,
            docProfile: false,
            AddSecond: {},
            loaderImage: false,
            successfullsent: true,
            addSec: false,
          });
        });
      setTimeout(() => {
        this.setState({ successfullsent: false });
      }, 5000);
    } else {
      this.setState({ error: true });
      setTimeout(() => {
        this.setState({ error: false });
      }, 5000);
    }
  };

  // fancybox open
  handleaddSecond = () => {
    this.setState({ addSec: true });
  };
  handleCloseDash = () => {
    this.setState({ addSec: false });
  };

  // Add the Prescription State
  AddState = (e) => {
    const state = this.state.AddSecond;
    state[e.target.name] = e.target.value;
    this.setState({ AddSecond: state });
  };
  //All doctors of the Pres
  alldoctor() {
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + "/UserProfile/DoctorUsers",commonHeader(user_token))
      .then((response) => {
        if (response.data.data && response.data.data.length > 0) {
          var data = [];
          response.data.data.map((item) => {
            var name = "";
            if (item.first_name && item.last_name) {
              name = item.first_name + " " + item.last_name;
            } else if (item.first_name) {
              name = item.first_name;
            }
            data.push({ value: item._id, label: name });
            return;
          });
          this.setState({ Pdoctors: data });
        }
      });
  }

  //Add doctor for Second Opinion
  AddDoctor = (e, name) => {
    const state = this.state.AddSecond;
    state[name] = e.value;
    this.setState({ AddSecond: state, selectedPdoc: e }, () => {
      if (this.state.AddSecond.doctor_id) {
        let doctor_id = this.state.AddSecond.doctor_id;
        axios
          .get(sitedata.data.path + "/UserProfile/DoctorProfile/" + doctor_id, commonHeader())
          .then((response) => {
            const found =
              this.state.personalinfo.fav_doctor &&
              this.state.personalinfo.fav_doctor.length > 0 &&
              this.state.personalinfo.fav_doctor.some(
                (el) => el.doctor === response.data.data.profile_id
              );
            this.setState({ docProfile: response.data.data, found: found });
          });
      }
    });
  };

  //For upload File related the second Opinion
  fileUpload = (event) => {
    if (
      event &&
      event[0] &&
      (event[0].type === "application/pdf" ||
        event[0].type === "image/jpeg" ||
        event[0].type === "image/png")
    ) {
      this.setState({
        isfileuploadmulti: true,
        loaderImage: true,
        err_pdf: false,
      });
      var fileattach = [];
      for (var i = 0; i < event.length; i++) {
        var file = event[i];
        let fileParts = event[i].name.split(".");
        let fileName = fileParts[0];
        let fileType = fileParts[1];
        axios
          .post(sitedata.data.path + "/aws/sign_s3", {
            fileName: fileName,
            fileType: fileType,
            folders:
              this.props.stateLoginValueAim.user.profile_id +
              "/second_opinion/",
            bucket: this.props.stateLoginValueAim.user.bucket,
          })
          .then((response) => {
            fileattach.push({
              filename:
                response.data.data.returnData.url +
                "&bucket=" +
                this.props.stateLoginValueAim.user.bucket,
            });
            this.setState({ fileupods: true });
            setTimeout(() => {
              this.setState({ fileupods: false });
            }, 5000);
            var returnData = response.data.data.returnData;
            var signedRequest = returnData.signedRequest;
            var url = returnData.url;
            if (fileType === "pdf") {
              fileType = "application/pdf";
            }
            // Put the fileType in the headers for the upload
            var options = { headers: { "Content-Type": fileType } };
            axios
              .put(signedRequest, file, options)
              .then((result) => {
                this.setState({
                  success: true,
                  loaderImage: false,
                  fileattach: fileattach,
                });
              })
              .catch((error) => {});
          })
          .catch((error) => {});
      }
    } else {
      this.setState({ err_pdf: true });
    }
  };

  render() {
    const { specialistOption } = this.state;
    const { stateLoginValueAim } = this.props;
    if (
      stateLoginValueAim.user === "undefined" ||
      stateLoginValueAim.token === 450 ||
      stateLoginValueAim.token === "undefined" ||
      stateLoginValueAim.user.type !== "patient" ||
      !this.props.verifyCode ||
      !this.props.verifyCode.code
    ) {
      return <Redirect to={"/"} />;
    }

    let translate = getLanguage(this.props.stateLanguageType)
    let {
      secnd_openion,
      New,
      inquiry,
      select,
      plz_upload_png_jpg,
      doc_require_for_second_openion,
      share_health_status,
      share_ur_jounral_status,
      share_health_status_info_from_journal,
      see_list_shared_info,
      specilist_and_secnd_openion,
      specialist,
      how_wuld_u_like_rcv_scnd_openion,
      online,
      home_add_mailbox,
      ur_profesion,
      Annotations,
      questions,
      details,
      attachments,
      save_entry,
      rqst_sent_succefully,
    } = translate;
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
                <LeftMenu isNotShow={true} currentPage="more" />
                <LeftMenuMobile isNotShow={true} currentPage="more" />
                {/* <Notification /> */}
                {/* End of Website Menu */}

                <Grid item xs={12} md={10} lg={9}>
                  <Grid className="scndOpinion">
                    <Grid container direction="row" className="ScndOpinLbl">
                      <Grid item xs={12} md={6}>
                        <label>{secnd_openion}</label>
                      </Grid>
                      <Grid item xs={12} md={6} className="ScndOpinRght">
                        <a onClick={this.handleaddSecond}>
                          + {New} {secnd_openion}
                        </a>
                      </Grid>
                    </Grid>

                    {/* Model setup */}
                    <Modal
                      open={this.state.addSec}
                      onClose={this.handleCloseDash}
                      className={
                        this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode === "dark"
                          ? "darkTheme opinBoxModel"
                          : "opinBoxModel"
                      }
                    >
                      <Grid className="opinBoxCntnt">
                        <Grid className="opinBoxCntntIner">
                          <Grid className="opinCourse">
                          <Grid container direction="row" justify="center">
                    <Grid item xs={8} md={8} lg={8}>
                    <p>
                              {New} {inquiry}
                            </p>
                            <Grid>
                              <label>{secnd_openion}</label>
                            </Grid>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <Grid>
                        <Grid className="entryCloseBtn">
                          <a onClick={this.handleCloseDash}>
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
                          {this.state.err_pdf && (
                            <div className="err_message">
                              {plz_upload_png_jpg}
                            </div>
                          )}
                          {this.state.error && (
                            <div className="err_message">
                              {doc_require_for_second_openion}
                            </div>
                          )}
                          <Grid className="shrHlthMain">
                            {!this.state.found && (
                              <Grid className="shrHlth">
                                <h2>{share_health_status}</h2>
                                <Grid className="shrHlthChk">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        value="checkedB"
                                        color="#00ABAF"
                                        name="share_to_doctor"
                                        checked={
                                          this.state.share_to_doctor === true &&
                                          this.state.share_to_doctor
                                        }
                                        onChange={(e) => {
                                          this.setState({
                                            share_to_doctor: e.target.checked,
                                          });
                                        }}
                                      />
                                    }
                                    label={share_ur_jounral_status}
                                  />
                                </Grid>
                                <p>{share_health_status_info_from_journal}</p>
                                <p>
                                  {see_list_shared_info}{" "}
                                  <a>
                                    <img
                                      src={require("assets/images/Info.svg")}
                                      alt=""
                                      title=""
                                    />
                                  </a>
                                </p>
                              </Grid>
                            )}
                            <Grid className="stndrdQues">
                              <h3>{specilist_and_secnd_openion}</h3>
                              <Grid className="splestQues">
                                <Grid>
                                  <label>{specialist}</label>
                                </Grid>
                                <Grid>
                                  <Select
                                    value={this.state.selectedPdoc}
                                    onChange={(e) =>
                                      this.AddDoctor(e, "doctor_id")
                                    }
                                    options={this.state.Pdoctors}
                                    placeholder={select}
                                    isSearchable={true}
                                    isMulti={false}
                                  />
                                </Grid>
                              </Grid>
                              <Grid className="recevPrescp">
                                <Grid className="recevPrescpLbl">
                                  <label>
                                    {how_wuld_u_like_rcv_scnd_openion}?
                                  </label>
                                </Grid>
                                <Grid className="recevPrescpChk">
                                  <FormControlLabel
                                    control={<Radio />}
                                    name="online_offline"
                                    value="online"
                                    color="#00ABAF"
                                    checked={
                                      this.state.AddSecond &&
                                      this.state.AddSecond.online_offline ===
                                        "online"
                                    }
                                    onChange={this.AddState}
                                    label={online}
                                  />
                                  <FormControlLabel
                                    control={<Radio />}
                                    name="online_offline"
                                    color="#00ABAF"
                                    value="offline"
                                    checked={
                                      this.state.AddSecond &&
                                      this.state.AddSecond.online_offline ===
                                        "offline"
                                    }
                                    onChange={this.AddState}
                                    label={home_add_mailbox}
                                  />
                                </Grid>
                              </Grid>
                              <Grid className="yrProfes">
                                <Grid>
                                  <label>{ur_profesion}</label>
                                </Grid>
                                <Grid>
                                  <input
                                    type="text"
                                    name="professions"
                                    value={
                                      this.state.AddSecond &&
                                      this.state.AddSecond.professions &&
                                      this.state.AddSecond.professions
                                    }
                                    onChange={this.AddState}
                                  />
                                </Grid>
                              </Grid>
                              <Grid className="yrProfes">
                                <Grid>
                                  <label>
                                    {Annotations} / {details} / {questions}
                                  </label>
                                </Grid>
                                <Grid>
                                  <textarea
                                    name="details"
                                    value={
                                      this.state.AddSecond &&
                                      this.state.AddSecond.details &&
                                      this.state.AddSecond.details
                                    }
                                    onChange={this.AddState}
                                  ></textarea>
                                </Grid>
                              </Grid>
                              <Grid className="attchForms attchImg">
                                <Grid>
                                  <label>{attachments}</label>
                                </Grid>
                                <FileUploader
                                  comesFrom="journal"
                                  name="UploadDocument"
                                  fileUpload={this.fileUpload}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid className="infoShwHidBrdr"></Grid>
                          <Grid className="infoShwHidIner">
                            <Grid className="infoShwSave">
                              <input
                                type="submit"
                                onClick={this.saveData}
                                value={save_entry}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Modal>
                    {/* End of Model setup */}
                    {this.state.successfullsent && (
                      <div className="success_message">
                        {rqst_sent_succefully}
                      </div>
                    )}
                    <ListingSecond newItem={this.state.newItemp} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
  const { verifyCode } = state.authy;
  // const { Doctorsetget } = state.Doctorset;
  // const { catfil } = state.filterate;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    verifyCode,
    //   Doctorsetget,
    //   catfil
  };
};
export default withRouter(
  connect(mapStateToProps, {
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    authy,
  })(Index)
);
