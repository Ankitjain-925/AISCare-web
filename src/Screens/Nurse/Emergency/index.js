import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Modal from "@material-ui/core/Modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LeftMenu from "Screens/Components/Menus/NurseLeftMenu/index";
import LeftMenuMobile from "Screens/Components/Menus/NurseLeftMenu/mobile";
import Checkbox from "@material-ui/core/Checkbox";
import Loader from "Screens/Components/Loader/index";
import { EmergencySet } from "Screens/Doctor/emergencyaction.js";
import { LanguageFetchReducer } from "Screens/actions";
import { withRouter } from "react-router-dom";
import sitedata from "sitedata";
import axios from "axios";
import { authy } from "Screens/Login/authy.js";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import EmergencyCall from "Screens/Components/EmergencyPage/index";
import { getLanguage } from "translations/index"
// import Notification from "Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications";
import { Settings } from "Screens/Login/setting";
import { commonHeader } from "component/CommonHeader/index";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPara: false,
      gettrackdatas: {},
      error_msg: false,
      loaderImage: false,
      personalinfo: {},
      terms_condition: false,
      error_msg1: false,
    };
  }

  //To get open Emergency Acccess
  getTrack = () => {
    var user_id = this.state.gettrackdatas.patient_id;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    if (user_id === "") {
      this.setState({ error_msg: true, error_msg1: false, loaderImage: false });
    } else if (!this.state.terms_condition) {
      this.setState({ error_msg1: true, error_msg: false, loaderImage: false });
    } else {
      axios
        .post(
          sitedata.data.path + "/UserProfile/GetUserInfo/" + user_id,
          {
            current_info: {
              profile_id: this.props.stateLoginValueAim.user.profile_id,
              first_name: this.props.stateLoginValueAim.user.first_name,
              last_name: this.props.stateLoginValueAim.user.last_name,
              email: this.props.stateLoginValueAim.user.email,
              alies_id: this.props.stateLoginValueAim.user.alies_id,
            },
            lan: this.props.stateLanguageType,
          },
         commonHeader(user_token)
        )
        .then((response) => {
          if (response.data.hassuccessed === true) {
            this.setState({
              loaderImage: false,
              error_msg: false,
              error_msg1: false,
              terms_condition: false,
            });
            this.props.EmergencySet(response.data.user_id);
            this.handleClosePara();
          } else {
            this.setState({
              error_msg: true,
              error_msg1: false,
              loaderImage: false,
            });
          }
        });
    }
    setTimeout(() => {
      this.setState({ error_msg: false, error_msg1: false });
    }, 5000);
  };

  //To open the Default Popup
  componentDidMount() {
    this.openPopUp();
  }

  //Open the pop up
  openPopUp = () => {
    if (this.props.Emergencysetget.p_id === null) {
      this.handleOpenPara();
    }
  };
  // fancybox open
  handleOpenPara = () => {
    this.setState({ openPara: true });
  };

  //for get the track data on the bases of pateint
  GetTrackData = (e) => {
    const state = this.state.gettrackdatas;
    state[e.target.name] = e.target.value;
    this.setState({ gettrackdatas: state });
  };
  handleClosePara = () => {
    this.setState({ openPara: false, error_msg: false, error_msg1: false });
  };
  anotherPatient = () => {
    var user_id = null;
    this.props.EmergencySet(user_id);
    this.handleOpenPara();
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      for_geting_emrgancy_data_on_a_click,
      view_emrgncy_data,
      emergancy_access_for_hospital_doc,
      emrgncy_data_access,
      patient_profile_is_not_correct,
      plz_accept_term_condition,
      imp_notice_b,
      this_will_trigger_following_action,
      send_email_to_patient_emrgancy,
      snd_sms_to_patient_emrgancy,
      snd_push_notification_to_patient_emrgancy,
      patient_id,
      I_hrwith_cnfirm_that_i_need_access_patient,
      emrgancy_access_for_non_connected,
    } = translate;
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
            ? "homeBg homeBgDrk"
            : "homeBg"
        }
      >
        <Grid className="homeBgIner">
          {this.state.loaderImage && <Loader />}
          <Grid container direction="row" justify="center">
            <Grid item xs={12} md={12}>
              <Grid container direction="row">
                {/* Website Menu */}
                <LeftMenu isNotShow={true} currentPage="emergency" />
                <LeftMenuMobile isNotShow={true} currentPage="emergency" />
                {/* <Notification /> */}
                {/* End of Website Menu */}

                <Grid item xs={12} md={10}>
                  {this.props.Emergencysetget.p_id !== null && (
                    <Grid className="emrgncyDataUpr">
                      {/* call Emergency Section */}
                      <EmergencyCall
                        byUser="nurse"
                        anotherPatient={this.anotherPatient}
                      />
                    </Grid>
                  )}
                  {!this.state.openPara &&
                    this.props.Emergencysetget.p_id === null && (
                      <Grid className="emrgncyDataUpr">
                        <Grid container direction="row">
                          <Grid item xs={12} md={10}>
                            <Grid className="emrgncyData">
                              <Grid className="EmergencyOpenPopup">
                                {for_geting_emrgancy_data_on_a_click}
                              </Grid>
                              <Grid className="paramSub">
                                <input
                                  type="submit"
                                  onClick={this.openPopUp}
                                  value={view_emrgncy_data}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* call Emergency Section */}
                      </Grid>
                    )}
                  {/* Model setup */}
                  <Modal
                    open={this.state.openPara}
                    onClose={this.handleClosePara}
                    className={
                      this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode &&
                      this.props.settings.setting.mode === "dark"
                        ? "darkTheme paraBoxModel"
                        : "paraBoxModel"
                    }
                  >
                    <Grid className="paraBoxCntnt">
                      <Grid className="paraCourse">
                      <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={8}>
                            <label>{emrgncy_data_access}</label>
                            <p>{emrgancy_access_for_non_connected}</p>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4}>
                            <Grid>
                            <Grid className="entryCloseBtn">
                                <a onClick={this.handleClosePara}>
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

                      {this.state.error_msg && (
                        <div className="err_message">
                          {patient_profile_is_not_correct}
                        </div>
                      )}
                      {this.state.error_msg1 && (
                        <div className="err_message">
                          {plz_accept_term_condition}
                        </div>
                      )}
                      <Grid className="imptNotic">
                        <h2>
                          <img
                            src={require("assets/images/important-notice.svg")}
                            alt=""
                            title=""
                          />
                          {imp_notice_b}
                        </h2>
                        <Grid className="trigerAction">
                          <Grid>
                            <label>{this_will_trigger_following_action}:</label>
                          </Grid>
                          <ul>
                            <li>{send_email_to_patient_emrgancy}</li>
                            <li>{snd_sms_to_patient_emrgancy}</li>
                            <li>{snd_push_notification_to_patient_emrgancy}</li>
                          </ul>
                        </Grid>

                        <Grid className="paraPatient">
                          <Grid>
                            <label>{patient_id}</label>
                          </Grid>
                          <Grid>
                            <input
                              type="text"
                              onChange={this.GetTrackData}
                              name="patient_id"
                            />
                          </Grid>
                        </Grid>

                        <Grid className="hereConfirm">
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="terms_conditions"
                                value="checkedB"
                                color="#00ABAF"
                                checked={this.state.terms_condition}
                                onChange={(e) => {
                                  this.setState({
                                    terms_condition: e.target.checked,
                                  });
                                }}
                              />
                            }
                            label={I_hrwith_cnfirm_that_i_need_access_patient}
                          />
                        </Grid>

                        <Grid className="paramSub">
                          <input
                            type="submit"
                            onClick={this.getTrack}
                            value={view_emrgncy_data}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Modal>
                  {/* End of Model setup */}
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
  const { Emergencysetget } = state.EmergencySet;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    verifyCode,
    Emergencysetget,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    authy,
    EmergencySet,
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
  })(Index)
);
