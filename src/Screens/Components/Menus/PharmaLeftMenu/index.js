import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { withRouter } from "react-router-dom";
import { LanguageFetchReducer } from "Screens/actions";
import LogOut from "Screens/Components/LogOut/index";
import Timer from "Screens/Components/TimeLogOut/index";
import Mode from "Screens/Components/ThemeMode/index.js";
// import { update_CometUser } from "Screens/Components/CommonApi/index";
import SetLanguage from "Screens/Components/SetLanguage/index.js";
import { getLanguage } from "translations/index"
import { getSetting } from "../api";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diagnosisdata: [],
      mediacationdata: [],
      allergydata: [],
      family_doc: [],
      donar: {},
      contact_partner: {},
      loaderImage: false,
      mode: "normal",
    };
    new Timer(this.logOutClick.bind(this));
  }

  //For loggedout if logged in user is deleted
  componentDidMount() {
   getSetting(this)
    new LogOut(
      this.props.stateLoginValueAim.token,
      this.props.stateLoginValueAim.user._id,
      this.logOutClick.bind(this)
    );
  }
  //For logout the User
  logOutClick = async () => {
    // var data = await update_CometUser(this.props?.stateLoginValueAim?.user?.profile_id.toLowerCase() , {lastActiveAt : Date.now()})
    // if(data){
      let email = "";
      let password = "";
      this.props.LoginReducerAim(email, password);
      let languageType = "en";
      this.props.LanguageFetchReducer(languageType);
    // }
  };

  openLanguageModel = () => {
    this.setState({ openFancyLanguage: true });
  };

  handleCloseFancyLanguage = () => {
    this.setState({ openFancyLanguage: false });
  };
  //For My Profile link
  ProfileLink = () => {
    this.props.history.push("/pharmacy/profile");
  };

  //For online Course
  OnlineCourse = () => {
    this.props.history.push("/pharmacy/online-course");
  };
  //For Timeline / Journal
  Journal = () => {
    this.props.history.push("/pharmacy/prescriptions");
  };
  //For chat
  // Chats = () => {
  //   this.props.history.push("/pharmacy");
  // };
  //fOR Archive prescription
  ArchivePrescription = () => {
    this.props.history.push("/pharmacy/prescription-archive");
  };

  //For Emergency
  Emergency = () => {
    this.props.history.push("/pharmacy/emergency");
  };

  PharmaEmergency = () => {
    this.props.history.push("/pharmacy/prescription-emergency");
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      prescriptions,
      chat_vdocall,
      pharmacy_access,
      emegancy_access,
      archive,
      my_profile,
      online_course,
      profile_setting,
      Language,
      DarkMode,
      logout,
    } = translate;
    return (
      <Grid
        item
        xs={12}
        md={1}
        className={
          this.props.settings &&
          this.props.settings.setting &&
          this.props.settings.setting.mode &&
          this.props.settings.setting.mode === "dark"
            ? "MenuLeftUpr MenuLeftDrkUpr"
            : "MenuLeftUpr"
        }
      >
        {/* <Notification /> */}
        <Grid className="webLogo">
          <a>
            <img
              src={require("assets/images/LogoPNG.png")}
              alt=""
              title=""
            />
          </a>
        </Grid>
        <Grid className="menuItems">
          <ul>
            <li
              className={this.props.currentPage === "journal" ? "menuActv" : ""}
            >
              <a onClick={this.Journal}>
                {this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark" ? (
                  <img
                    src={require("assets/images/nav-my-documents-inquiries-active.svg")}
                    alt=""
                    title=""
                  />
                ) : (
                  <img
                    src={require("assets/images/nav-my-documents-inquiries.svg")}
                    alt=""
                    title=""
                  />
                )}

                <span>{prescriptions}</span>
              </a>
            </li>
            <li className={this.props.currentPage === "chat" ? "menuActv" : ""}>
              <a onClick={this.Chats}>
                {this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark" ? (
                  <img
                    src={require("assets/images/nav-chat-white.svg")}
                    alt=""
                    title=""
                  />
                ) : (
                  <img
                    src={require("assets/images/nav-chat.svg")}
                    alt=""
                    title=""
                  />
                )}

                <span>{chat_vdocall}</span>
              </a>
            </li>
            <li
              className={
                this.props.currentPage === "emergency" ? "menuActv" : ""
              }
            >
              <a onClick={this.Emergency}>
                {this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark" ? (
                  <img
                    src={require("assets/images/ermerAccess-white.svg")}
                    alt=""
                    title=""
                  />
                ) : (
                  <img
                    src={require("assets/images/ermerAccess.svg")}
                    alt=""
                    title=""
                  />
                )}

                <span>{emegancy_access}</span>
              </a>
            </li>
            <li
              className={
                this.props.currentPage === "pharmajournal" ? "menuActv" : ""
              }
            >
              <a onClick={this.PharmaEmergency}>
                {this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark" ? (
                  <img
                    src={require("assets/images/ermerAccess-white.svg")}
                    alt=""
                    title=""
                  />
                ) : (
                  <img
                    src={require("assets/images/ermerAccess.svg")}
                    alt=""
                    title=""
                  />
                )}

                <span>{pharmacy_access}</span>
              </a>
            </li>
            <li
              className={this.props.currentPage === "course" ? "menuActv" : ""}
            >
              <a onClick={this.OnlineCourse}>
                {this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark" ? (
                  <img
                    src={require("assets/images/onlineCourses-white.svg")}
                    alt=""
                    title=""
                  />
                ) : (
                  <img
                    src={require("assets/images/onlineCourses.svg")}
                    alt=""
                    title=""
                  />
                )}

                <span>AIS {online_course}</span>
              </a>
            </li>
            <li className={this.props.currentPage === "more" ? "menuActv" : ""}>
              <a onClick={this.ArchivePrescription}>
                {this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark" ? (
                  <img
                    src={require("assets/images/archive-white.svg")}
                    alt=""
                    title=""
                  />
                ) : (
                  <img
                    src={require("assets/images/archive.svg")}
                    alt=""
                    title=""
                  />
                )}

                <span>
                  {prescriptions} {archive}
                </span>
              </a>
            </li>
            {/* <li className={this.props.currentPage === 'more' ? "menuActv" : ""}>
                            <a className="moreMenu">
                            <img src={require('assets/images/nav-more.svg')} alt="" title="" />
                            
                                <span>More</span>

                                <div className="moreMenuList">
                                    <ul>
                                        <li><a onClick={this.ArchivePrescription}><img src={require('assets/images/menudocs.jpg')} alt="" title="" />Prescriptions Archive</a></li>
                                    </ul>
                                </div>
                            </a>

                        </li> */}
            <li
              className={this.props.currentPage === "profile" ? "menuActv" : ""}
            >
              <a className="profilMenu">
                <img
                  src={require("assets/images/nav-my-profile.svg")}
                  alt=""
                  title=""
                />

                <span>{my_profile}</span>
                <div className="profilMenuList">
                  <ul>
                    <li>
                      <a onClick={this.ProfileLink}>
                        {this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === "dark" ? (
                          <img
                            src={require("assets/images/menudocs-white.jpg")}
                            alt=""
                            title=""
                          />
                        ) : (
                          <img
                            src={require("assets/images/menudocs.jpg")}
                            alt=""
                            title=""
                          />
                        )}

                        {profile_setting}
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          this.openLanguageModel();
                        }}
                      >
                        {" "}
                        {this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === "dark" ? (
                          <img
                            src={require("assets/images/menudocs-white.jpg")}
                            alt=""
                            title=""
                          />
                        ) : (
                          <img
                            src={require("assets/images/menudocs.jpg")}
                            alt=""
                            title=""
                          />
                        )}
                        {Language}
                      </a>
                    </li>
                    <li>
                      <a>
                        {" "}
                        {this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === "dark" ? (
                          <img
                            src={require("assets/images/menudocs-white.jpg")}
                            alt=""
                            title=""
                          />
                        ) : (
                          <img
                            src={require("assets/images/menudocs.jpg")}
                            alt=""
                            title=""
                          />
                        )}
                        {DarkMode}
                        <Mode
                          mode={this.props.settings?.setting?.mode ? this.props.settings?.setting?.mode : 'normal'}
                          name="mode"
                          getSetting={()=>getSetting(this)}
                        />
                      </a>
                    </li>
                    <li onClick={this.logOutClick}>
                      <a>
                        {" "}
                        {this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === "dark" ? (
                          <img
                            src={require("assets/images/menudocs-white.jpg")}
                            alt=""
                            title=""
                          />
                        ) : (
                          <img
                            src={require("assets/images/menudocs.jpg")}
                            alt=""
                            title=""
                          />
                        )}
                        {logout}
                      </a>
                    </li>
                  </ul>
                </div>
              </a>
            </li>
          </ul>
        </Grid>
        <SetLanguage
          getSetting={()=>getSetting(this)}
          openFancyLanguage={this.state.openFancyLanguage}
          languageValue={this.state.languageValue}
          handleCloseFancyLanguage={this.handleCloseFancyLanguage}
          openLanguageModel={this.openLanguageModel}
        />
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
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
  };
};
export default withRouter(
  connect(mapStateToProps, { LoginReducerAim, LanguageFetchReducer, Settings })(
    Index
  )
);
