import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
// import { Doctorset } from '../../Doctor/actions';
// import { filterate } from '../../Doctor/filteraction';
import { withRouter } from "react-router-dom";
import { LanguageFetchReducer } from "Screens/actions";
import LogOut from "Screens/Components/LogOut/index";
import Timer from "Screens/Components/TimeLogOut/index";
import { Fitbit } from "Screens/Patient/Tracker/fitbit";
import { Withings } from "Screens/Patient/Tracker/withing.js";
import sitedata from "sitedata";
import { update_CometUser } from "Screens/Components/CommonApi/index";
import axios from "axios";
import Mode from "Screens/Components/ThemeMode/index.js";
import SetLanguage from "Screens/Components/SetLanguage/index.js";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction";
import Loader from "Screens/Components/Loader/index";
import { getLanguage } from "translations/index"
import { commonHeader } from "component/CommonHeader/index"

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
          openFancyLanguage: false,
          PassDone: false,
          mode: "normal",
        };
        new Timer(this.logOutClick.bind(this));
      }
    
      //For loggedout if logged in user is deleted
      componentDidMount() {
        new LogOut(
          this.props.stateLoginValueAim.token,
          this.props.stateLoginValueAim.user._id,
          this.logOutClick.bind(this)
        );
        this.getSetting();
      }
    
      getSetting = () => {
        this.setState({ loaderImage: true });
        axios
          .get(sitedata.data.path + "/UserProfile/updateSetting",  commonHeader(this.props.stateLoginValueAim.token))
          .then((responce) => {
            if (responce.data.hassuccessed && responce.data.data) {
              this.setState({
                timeF: {
                  label: responce.data.data.time_format,
                  value: responce.data.data.time_format,
                },
                dateF: {
                  label: responce.data.data.date_format,
                  value: responce.data.data.date_format,
                },
              });
              this.props.Settings(responce.data.data);
            } else {
              this.props.Settings({
                user_id: this.props.stateLoginValueAim.user._id,
              });
            }
            this.setState(
              {
                loaderImage: false,
                languageValue:
                  responce.data.data && responce.data.data.language
                    ? responce.data.data.language
                    : "en",
                mode:
                  responce.data.data && responce.data.data.mode
                    ? responce.data.data.mode
                    : "normal",
              },
              () => {
                this.props.LanguageFetchReducer(this.state.languageValue);
              }
            );
          });
      };
    
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
       var data = await update_CometUser(this.props?.stateLoginValueAim?.user?.profile_id.toLowerCase() , {lastActiveAt : Date.now()})
        if(data){
          let email = "";
          let password = "";
          this.props.houseSelect({value: null});
          this.props.LoginReducerAim(email, password);
          let languageType = "en";
          this.props.LanguageFetchReducer(languageType);
        }
        this.props.history.push("/");
      };
    
    moveSpace=()=>{
        this.props.history.push('/virtualHospital/space')
    }
    moveService=()=>{
        this.props.history.push('/virtualHospital/services')
    }
    moveTask=()=>{
        this.props.history.push('/virtualHospital/tasks')
    }
    moveCalendar=()=>{
        this.props.history.push('/virtualHospital/calendar')
    }
    moveFlow=()=>{
        this.props.history.push('/virtualHospital/patient-flow')
    }

    moveInstitute=()=>{
        this.props.houseSelect({value: null});
        this.props.history.push('/virtualHospital/institutes')
    }

    render() {
        return (
             <Grid className="MenuWeb vh-menu">
                 <Grid className="webLogo">
                     <a href=""><img src={require('assets/virtual_images/logo_new.png')} alt="" title="" /></a>
                 </Grid>
                 <Grid className="menuItems">
                     <ul>
                         <li onClick={this.moveFlow}><a href="" className={this.props.currentPage === "flow"? "active-menu":""}><img src={require('assets/virtual_images/barMenu.png')} alt="" title="" />
                         <span>
                       Patient Flow                </span></a></li>
                         <li onClick={this.moveCalendar}><a href="" className={this.props.currentPage === "calendar"? "active-menu":""}><img src={require('assets/virtual_images/calender.png')} alt="" title="" />
                         <span>
                       Calendar
                </span></a></li>
                         <li onClick={this.moveTask}><a href="" className={this.props.currentPage === "task"? "active-menu":""}><img src={require('assets/virtual_images/rightpng.png')} alt="" title="" />
                         <span>Tasks</span></a></li>
                         <li onClick={this.moveSpace}><a href="" className={this.props.currentPage === "space"? "active-menu":""}><img src={require('assets/virtual_images/bed.png')} alt="" title="" />
                         <span>
                       Space Management
                </span></a></li>
                         <li onClick={this.moveInstitute}><a href=""><img src={require('assets/virtual_images/hospitalIcon.png')} alt="" title="" />
                         <span>
                        Change Hospital
                </span></a></li>
                         <li className={this.props.currentPage === "more"? "active-menu":""}>
                            <a className="moreMenu">
                                <img src={require('assets/virtual_images/nav-more.svg')} alt="" title="" />
                                <div className="moreMenuList">
                               
                                <ul>
                                    <li>
                                    <a onClick={this.moveService}>
                                        {/* {this.props.settings &&
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
                                        )} */}
                                        Services
                                    </a>
                                    </li>
                                </ul>
                                </div>
                                <span>More</span>
                            </a>
                        </li>
                         <li>
                             <a className="profilMenu" href="">
                                 <img src={require('assets/virtual_images/nav-my-profile.svg')} alt="" title="" />
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
                        Profile setting
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
                            src={require("assets/images/menudocs.jpg")}
                            alt=""
                            title=""
                          />
                        )}
                        Language
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
                        {"Dark Mode"}{" "}
                        <Mode
                          mode={this.state.mode}
                          name="mode"
                          getSetting={this.getSetting}
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
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
                             </a>
                         </li>
                     </ul>
                 </Grid>
                 <SetLanguage
          getSetting={this.getSetting}
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
    const { fitbit } = state.Fitbit;
    const { withing } = state.Withings;
    const { House } = state.houseSelect;
    // const { Doctorsetget } = state.Doctorset;
    // const { catfil } = state.filterate;
    return {
      stateLanguageType,
      stateLoginValueAim,
      loadingaIndicatoranswerdetail,
      settings,
      fitbit,
      withing,
      House,
      //   Doctorsetget,
      //   catfil
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
    })(Index)
  );