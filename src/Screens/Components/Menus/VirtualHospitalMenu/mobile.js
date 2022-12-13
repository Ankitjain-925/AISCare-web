import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { withRouter } from "react-router-dom";
import { LanguageFetchReducer } from "Screens/actions";
import LogOut from "Screens/Components/LogOut/index";
import Timer from "Screens/Components/TimeLogOut/index";
import { Fitbit } from "Screens/Patient/Tracker/fitbit";
import { Withings } from "Screens/Patient/Tracker/withing.js";
import { update_CometUser } from "Screens/Components/CommonApi/index";
import Mode from "Screens/Components/ThemeMode/index.js";
import SetLanguage from "Screens/Components/SetLanguage/index.js";
import { getLanguage } from "translations/index";
import { slide as Menu } from "react-burger-menu";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction";
import { getSetting } from "../api";
import { Speciality } from "Screens/Login/speciality.js";
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
    getSetting(this);
    new LogOut(
      this.props.stateLoginValueAim.token,
      this.props.stateLoginValueAim.user._id,
      this.logOutClick.bind(this)
    );
  }
  //For close the model
  openLanguageModel = () => {
    this.setState({ openFancyLanguage: true });
  };

  //For open Model
  handleCloseFancyLanguage = () => {
    this.setState({ openFancyLanguage: false });
  };

  //For logout the User
  logOutClick = async () => {
    var data = await update_CometUser(
      this.props?.stateLoginValueAim?.user?.profile_id.toLowerCase(),
      { lastActiveAt: Date.now() }
    );
    if (data) {
      let email = "";
      let password = "";
      this.props.LoginReducerAim(email, password);
      let languageType = "en";
      this.props.LanguageFetchReducer(languageType);
      this.props.houseSelect({ value: null });
      this.props.Speciality(false);
      this.props.Fitbit({
        lifetimeStats: {},
        device: [],
        distance: {},
        steps: {},
        user: {},
        badges: {},
      });
      this.props.Withings([]);
    }
    this.props.history.push("/");
  };

  //For external Spaces
  externalSpaces = () => {
    this.props.history.push('/virtualHospital/external-space');
  };

  //For show question from hospital
  questionshow = () => {
    this.props.history.push('/virtualHospital/carequestionnary-submit');
  };

  //For Spaces
  Spaces = () => {
    this.props.history.push("/virtualHospital/space");
  };
  //For Services
  Services = () => {
    this.props.history.push("/virtualHospital/services");
  };
  //For Tasks
  Tasks = () => {
    this.props.history.push("/virtualHospital/tasks");
  };
  //Assigned Services
  AssignedServices = () => {
    this.props.history.push("/virtualHospital/assignedservices");
  };
  //For calendar
  Calendar = () => {
    this.props.history.push("/virtualHospital/calendar");
  };
  //For calendar
  ProfileLink = () => {
    this.props.history.push("/virtualHospital/profile");
  };
  //For change Institutes
  MoveInstitute = () => {
    this.props.houseSelect({ value: null });
    this.props.history.push("/virtualHospital/institutes");
  };

  PatientFlow = () => {
    this.props.history.push("/virtualHospital/patient-flow");
  };

  Statistics = () => {
    this.props.history.push("/virtualHospital/statistics");
  };

  Billing = () => {
    this.props.history.push("/virtualHospital/bills");
  };

  Invoice = () => {
    this.props.history.push("/virtualHospital/invoices");
  };

  InvoicePattern = () => {
    this.props.history.push("/virtualHospital/invoice_pattern");
  };

  PatientDetail = () => {
    this.props.history.push("/virtualHospital/patient-detail");
  };

  Questionaires = () => {
    this.props.history.push("/virtualHospital/questionnaire");
  };

  Staffgroup = () => {
    this.props.history.push("/virtualHospital/staff-group");
  };
  AssignTherapy = () => {
    this.props.history.push("/virtualHospital/add-therapy");
  };
  render() {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      external_space_management,
      Care_Questionnary_Submit,
      my_profile,
      profile_setting,
      Language,
      DarkMode,
      logout,
      Patientflow,
      Calendar,
      Tasks,
      SpaceManagement,
      ChangeHospital,
      More,
      Services,
      Statistics,
      Billing,
      Invoices,
      InvoicePattern,
      Questionnaire,
      assigned_services,
      CreateStaffgroup,
      AssignTherapy
    } = translate;
    return (
      <Grid
        className={
          this.props.settings &&
            this.props.settings.setting &&
            this.props.settings.setting.mode &&
            this.props.settings.setting.mode === "dark"
            ? "MenuMob MenuLeftDrkUpr"
            : "MenuMob"
        }
      >
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6} md={6} sm={6} className="MenuMobLeft">
            <a>
              <img
                src={require("assets/images/navigation-drawer.svg")}
                alt=""
                title=""
                className="MenuImg"
              />
            </a>
            <Menu className="addCstmMenu">
              <Grid className="menuItems">
                <ul>
                  {this.props?.House?.value && (
                    <>
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('patient_flow') &&
                        <li
                          className={
                            this.props.currentPage === "flow" ? "menuActv" : ""
                          }
                        >
                          <a onClick={this.PatientFlow}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === "dark" ? (
                              <img
                                src={require("assets/virtual_images/Patientbar2.png")}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === "flow"
                                    ? require("assets/virtual_images/Patientbar2.png")
                                    : require("assets/virtual_images/barMenu.png")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{Patientflow}</span>
                          </a>
                        </li>}
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('Calendar') &&
                        <li
                          className={
                            this.props.currentPage === "calendar"
                              ? "menuActv"
                              : ""
                          }
                        >
                          <a onClick={this.Calendar}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === "dark" ? (
                              <img
                                src={require("assets/virtual_images/calenderIcon2.png")}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === "calendar"
                                    ? require("assets/virtual_images/calenderIcon2.png")
                                    : require("assets/virtual_images/calender.png")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{Calendar}</span>
                          </a>
                        </li>}
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('task_manager') &&
                        <li
                          className={
                            this.props.currentPage === "task" ? "menuActv" : ""
                          }
                        >
                          <a onClick={this.Tasks}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === "dark" ? (
                              <img
                                src={require("assets/virtual_images/rightIcon2.png")}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === "task"
                                    ? require("assets/virtual_images/rightIcon2.png")
                                    : require("assets/virtual_images/rightpng.png")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{Tasks}</span>
                          </a>
                        </li>}
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('assigned_services') &&
                        <li
                          className={
                            this.props.currentPage === "assignedservices"
                              ? "menuActv"
                              : ""
                          }
                        >
                          <a onClick={this.AssignedServices}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === "dark" ? (
                              <img
                                src={require("assets/virtual_images/rightIcon2.png")}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === "assignedservices"
                                    ? require("assets/virtual_images/rightIcon2.png")
                                    : require("assets/virtual_images/rightpng.png")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{assigned_services}</span>
                          </a>
                        </li>}
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('space_managemnet') &&
                        <li
                          className={
                            this.props.currentPage === "space" ? "menuActv" : ""
                          }
                        >
                          <a onClick={this.Spaces}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === "dark" ? (
                              <img
                                src={require("assets/virtual_images/PatientBed.png")}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === "space"
                                    ? require("assets/virtual_images/PatientBed.png")
                                    : require("assets/virtual_images/bed.png")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{SpaceManagement}</span>
                          </a>
                        </li>}
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('external_space_managemnet') &&
                        <li
                          className={
                            this.props.currentPage === 'externalspace' ? 'menuActv' : ''
                          }
                        >
                          <a onClick={this.externalSpaces}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === 'dark' ? (
                              <img
                                src={require('assets/virtual_images/PatientBed.png')}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === 'externalspace'
                                    ? require('assets/virtual_images/PatientBed.png')
                                    : require('assets/virtual_images/bed.png')
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{external_space_management}</span>
                          </a>
                        </li>}
                      {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('care_questionnary') &&
                        <li
                          className={
                            this.props.currentPage === 'showquestion' ? 'menuActv' : ''
                          }
                        >
                          <a onClick={this.questionshow}>
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === 'dark' ? (
                              <img
                                src={require("assets/virtual_images/rightIcon2.png")}
                                alt=""
                                title=""
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === 'showquestion'
                                    ? require("assets/virtual_images/rightIcon2.png")
                                    : require("assets/virtual_images/rightpng.png")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{Care_Questionnary_Submit}</span>
                          </a>
                        </li>}
                    </>
                  )}
                  <li
                    className={
                      this.props.currentPage === "institute" ? "menuActv" : ""
                    }
                  >
                    <a onClick={this.MoveInstitute}>
                      {this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === "dark" ? (
                        <img
                          src={require("assets/virtual_images/hospitalIcon2.png")}
                          alt=""
                          title=""
                        />
                      ) : (
                        <img
                          src={
                            this.props.currentPage === "institute"
                              ? require("assets/virtual_images/hospitalIcon2.png")
                              : require("assets/virtual_images/hospitalIcon.png")
                          }
                          alt=""
                          title=""
                        />
                      )}
                      <span>{ChangeHospital}</span>
                    </a>
                  </li>
                  {this.props?.House?.value && (
                    <>

                      {this.props?.House?.roles?.length > 0 && (this.props?.House?.roles.includes('service_manager') || this.props?.House?.roles.includes('questionnaire')) &&
                        <li
                          className={
                            this.props.currentPage === "more" ? "menuActv" : ""
                          }
                        >
                          <a className="moreMenu">
                            {this.props.settings &&
                              this.props.settings.setting &&
                              this.props.settings.setting.mode &&
                              this.props.settings.setting.mode === "dark" ? (
                              <img
                                src={require("assets/images/nav-more-white.svg")}
                                alt=""
                                title=""
                                className="manage-dark-back"
                              />
                            ) : (
                              <img
                                src={
                                  this.props.currentPage === "more"
                                    ? require("assets/images/nav-more-white.svg")
                                    : require("assets/images/nav-more.svg")
                                }
                                alt=""
                                title=""
                              />
                            )}
                            <span>{More}</span>

                            <div className="moreMenuList">
                              <ul>
                                {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('service_manager') &&
                                  <li>
                                    <a onClick={this.Services}>
                                      {this.props.settings &&
                                        this.props.settings.setting &&
                                        this.props.settings.setting.mode &&
                                        this.props.settings.setting.mode ===
                                        "dark" ? (
                                        <img
                                          src={require("assets/images/menudocs-white.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      ) : (
                                        <img
                                          src={require("assets/virtual_images/menudocs.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      )}
                                      {Services}
                                    </a>
                                  </li>}
                                {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('patient_flow') &&
                                  <li>
                                    <a onClick={this.Statistics}>
                                      {this.props.settings &&
                                        this.props.settings.setting &&
                                        this.props.settings.setting.mode &&
                                        this.props.settings.setting.mode ===
                                        "dark" ? (
                                        <img
                                          src={require("assets/images/menudocs-white.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      ) : (
                                        <img
                                          src={require("assets/virtual_images/menudocs.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      )}

                                      {Statistics}
                                    </a>
                                  </li>}
                                {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('service_manager') &&
                                  <li>
                                    <a onClick={this.Billing}>
                                      {this.props.settings &&

                                        this.props.settings.setting &&
                                        this.props.settings.setting.mode &&
                                        this.props.settings.setting.mode ===
                                        "dark" ? (
                                        <img
                                          src={require("assets/images/menudocs-white.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      ) : (
                                        <img
                                          src={require("assets/virtual_images/menudocs.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      )}

                                      {Billing}
                                    </a>
                                  </li>}
                                {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('service_manager') &&
                                  <li>
                                    <a onClick={this.Invoice}>
                                      {this.props.settings &&
                                        this.props.settings.setting &&
                                        this.props.settings.setting.mode &&
                                        this.props.settings.setting.mode ===
                                        "dark" ? (
                                        <img
                                          src={require("assets/images/menudocs-white.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      ) : (
                                        <img
                                          src={require("assets/virtual_images/menudocs.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      )}

                                      {Invoices}
                                    </a>
                                  </li>}
                                {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('service_manager') &&
                                  <li>
                                    <a onClick={this.InvoicePattern}>
                                      {this.props.settings &&
                                        this.props.settings.setting &&
                                        this.props.settings.setting.mode &&
                                        this.props.settings.setting.mode ===
                                        "dark" ? (
                                        <img
                                          src={require("assets/images/menudocs-white.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      ) : (
                                        <img
                                          src={require("assets/virtual_images/menudocs.jpg")}
                                          alt=""
                                          title=""
                                        />
                                      )}

                                      {InvoicePattern}
                                    </a>
                                  </li>}
                                {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('group_staff_manager') &&
                                  <>
                                    <li>
                                      <a onClick={this.Staffgroup}>
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
                                            src={require("assets/virtual_images/menudocs.jpg")}
                                            alt=""
                                            title=""
                                          />
                                        )}


                                        {CreateStaffgroup}
                                      </a>
                                    </li>
                                    {this.props?.House?.roles?.length > 0 && this.props?.House?.roles.includes('therapy_manager') &&
                                      <li>
                                        <a onClick={this.AssignTherapy}>
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
                                              src={require("assets/virtual_images/menudocs.jpg")}
                                              alt=""
                                              title=""
                                            />
                                          )}

                                          {AssignTherapy}
                                        </a>
                                      </li>}
                                    <li>
                                      <a onClick={this.Questionaires}>
                                        {this.props.settings &&
                                          this.props.settings.setting &&
                                          this.props.settings.setting.mode &&
                                          this.props.settings.setting.mode ===
                                          "dark" ? (
                                          <img
                                            src={require("assets/images/menudocs-white.jpg")}
                                            alt=""
                                            title=""
                                          />
                                        ) : (
                                          <img
                                            src={require("assets/virtual_images/menudocs.jpg")}
                                            alt=""
                                            title=""
                                          />
                                        )}

                                        {Questionnaire}
                                      </a>
                                    </li>
                                  </>}
                              </ul>
                            </div>
                          </a>
                        </li>}

                    </>
                  )}
                  <li
                    className={
                      this.props.currentPage === "profile" ? "menuActv" : ""
                    }
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
                            <a onClick={() => this.ProfileLink()}>
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
                                  src={require("assets/virtual_images/menudocs.jpg")}
                                  alt=""
                                  title=""
                                />
                              )}
                              {Language}
                            </a>
                          </li>
                          <li>
                            <a>
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
                              {DarkMode}{" "}
                              <Mode
                                mode={
                                  this.props.settings?.setting?.mode
                                    ? this.props.settings?.setting?.mode
                                    : "normal"
                                }
                                name="mode"
                                getSetting={() => getSetting(this)}
                              />
                            </a>
                          </li>
                          <li onClick={this.logOutClick}>
                            <a>
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
            </Menu>
          </Grid>
          <Grid item xs={6} md={6} sm={6} className="MenuMobRght">
            <a>
              <img
                src={require("assets//images/LogoPNG.png")}
                alt=""
                title=""
              />
            </a>
          </Grid>
        </Grid>
        {/* For set the language  */}
        <SetLanguage
          comesFrom="adminstaff"
          getSetting={() => getSetting(this)}
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
  const { stateLoginValueAim, loadingaIndicatoranswerdetail } =
    state.LoginReducerAim;
  const { stateLanguageType } = state.LanguageReducer;
  const { settings } = state.Settings;
  const { fitbit } = state.Fitbit;
  const { withing } = state.Withings;
  const { House } = state.houseSelect;
  const { speciality } = state.Speciality;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    fitbit,
    withing,
    House,
    speciality,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    Fitbit,
    Withings,
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    houseSelect,
    Speciality,
  })(Index)
);
