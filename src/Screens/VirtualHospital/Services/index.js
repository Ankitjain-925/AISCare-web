import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import LeftMenu from "Screens/Components/Menus/VirtualHospitalMenu/index";
import LeftMenuMobile from "Screens/Components/Menus/VirtualHospitalMenu/mobile";
import VHfield from "Screens/Components/VirtualHospitalComponents/VHfield/index";
import Modal from "@material-ui/core/Modal";
import { confirmAlert } from "react-confirm-alert";
import Pagination from "Screens/Components/Pagination/index";
import { withRouter } from "react-router-dom";
import { Redirect, Route } from "react-router-dom";
import { authy } from "Screens/Login/authy.js";
import { connect } from "react-redux";
import { LanguageFetchReducer } from "Screens/actions";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { houseSelect } from "../Institutes/selecthouseaction";
import Loader from "Screens/Components/Loader/index";
import sitedata from "sitedata";
import axios from "axios";
import { commonHeader } from "component/CommonHeader/index";
import AssignedService from "Screens/Components/VirtualHospitalComponents/AssignedService";
import Select from "react-select";
import {
  getSpecialty,
  getAllServices,
  handleSubmit,
  getSpecialtyData,
  selectedID,
  deleteClickService,
  onChangePage,
  handleOpenServ,
  handleCloseServ,
  updateEntryState1,
  EditService,
  onFieldChange,
  searchFilter,
  getAmount,
  EditAssignedService,
} from "./api";
import { getLanguage } from "translations/index";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openServ: false,
      title: "",
      description: "",
      price: "",
      house_id: "",
      speciality_id: false,
      services_data: [],
      AllServices: [],
      updateTrack: {},
      AllSpeciality: [],
      errorMsg: "",
      SearchValue: "",
      sickamount: true,
      sickamount1: {},
      openAss: false

    };
  }

  componentDidMount() {
    getSpecialty(this);
    getAllServices(this);
    getAmount(this);
    if (
      this.props.history.location?.state?.openAssign
    ) {
      this.setState({ openAss: true });
    }
  }

  //Delete the perticular service confirmation box
  removeServices = (id) => {
    this.setState({ message: null, openTask: false });
    let translate = getLanguage(this.props.stateLanguageType);
    let { removeService, sure_removeService, No, Yes } = translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark"
                ? "dark-confirm react-confirm-alert-body"
                : "react-confirm-alert-body"
            }
          >
            <h1>{removeService}</h1>

            <p>{sure_removeService}</p>
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>{No}</button>
              <button
                onClick={() => {
                  this.removeServices2(id);
                  // onClose();
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

  removeServices2 = (id) => {
    this.setState({ message: null, openTask: false });
    let translate = getLanguage(this.props.stateLanguageType);
    let { removeService, really_want_to_remove_service, No, Yes } = translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === "dark"
                ? "dark-confirm react-confirm-alert-body"
                : "react-confirm-alert-body"
            }
          >
            <h1 class="alert-btn">{removeService}</h1>

            <p>{really_want_to_remove_service}</p>
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>{No}</button>
              <button
                onClick={() => {
                  deleteClickService(id, this);
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

  updateEntryState2 = (event) => {
    var state = this.state.sickamount1;
    state[event.target.name] = event.target.value;
    this.setState({ sickamount1: state });
  };

  EditAmount = () => {
    if (
      this.state.sickamount1.amount >= 21 ||
      this.state.sickamount1.amount <= 9
    ) {
    } else {
      let translate = getLanguage(this.props.stateLanguageType);
      let { Something_went_wrong } = translate;
      var a = this.state.sickamount1.amount;
      axios
        .put(
          sitedata.data.path + "/vactive/AddAmount/" + this.props.House.value,
          { sickleave_certificate_amount: a },
          commonHeader(this.props.stateLoginValueAim.token)
        )
        .then((responce) => {
          this.setState({ loaderImage: false });
          if (responce.data.hassuccessed) {
            this.setState({ sickamount: true });
          } else {
            this.setState({ errorMsg: Something_went_wrong });
          }
        });
    }
  };
  onSickamount = (e) => {
    if (e.key === "Enter") {
      this.EditAmount();
      // this.setState({ sickamount: true });
    }
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Addnewservice,
      Services,
      speciality,
      newService,
      save_and_close,
      all,
      General,
      srvc,
      Price,
      editService,
      deleteService,
      EnterServicename,
      Enterserviceshortdescription,
      Enterserviceprice,
      Search,
      Serviceshortdescription,
      Servicename,
      Sick_Certificate_Amount,
      edit_assigned_services,
      delete_assigned_services,
      no_data_avlbl
    } = translate;
    const { services_data } = this.state;
    const { stateLoginValueAim, House } = this.props;
    if (
      stateLoginValueAim.user === "undefined" ||
      stateLoginValueAim.token === 450 ||
      stateLoginValueAim.token === "undefined" ||
      stateLoginValueAim.user.type !== "adminstaff" ||
      !this.props.verifyCode ||
      !this.props.verifyCode.code
    ) {
      return <Redirect to={"/"} />;
    }
    if (House && House?.value === null) {
      return <Redirect to={"/VirtualHospital/institutes"} />;
    }

    const { House: { roles = [] } = {} } = this.props || {}
    return (
      <Grid
        className={
          this.props.settings &&
            this.props.settings.setting &&
            this.props.settings.setting.mode &&
            this.props.settings.setting.mode === "dark"
            ? "homeBg darkTheme"
            : "homeBg"
        }
      >
        <Grid className="homeBgIner vh-section">
          {this.state.loaderImage && <Loader />}
          <Grid container direction="row">
            <Grid item xs={12} md={12}>
              {/* Mobile menu */}
              <LeftMenuMobile isNotShow={true} currentPage="more" />
              <Grid container direction="row">
                {/* Start of Menu */}
                <Grid item xs={12} md={1} className="MenuLeftUpr">
                  <LeftMenu isNotShow={true} currentPage="more" />
                </Grid>
                {/* End of Menu */}

                {/* Start of Right Section */}
                <Grid item xs={12} md={10}>
                  <Grid className="topLeftSpc">
                    <Grid container direction="row">
                      <Grid item xs={6} md={6}>
                        {/* Back common button */}
                        {/* <Grid className="extSetting">
                                <a><img src={require('assets/virtual_images/rightArrow.png')} alt="" title="" />
                                    Back to Billing</a>
                            </Grid> */}
                        {/* End of Back common button */}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid className="openAssser">
                          {/* <Grid className="allOpenAsser">
                            <AssignedService openAss={this.state.openAss} />
                          </Grid> */}

                          <Grid className="newServc">
                            {roles.includes('add_service') &&
                              <Button onClick={() => handleOpenServ(this)}>
                                {newService}
                              </Button>}
                            <Modal
                              open={this.state.openServ}
                              onClose={() => handleCloseServ(this)}
                              className={
                                this.props.settings.setting &&
                                  this.props.settings.setting.mode &&
                                  this.props.settings.setting.mode === "dark"
                                  ? "darkTheme addSpeclModel"
                                  : "addSpeclModel"
                              }
                            >
                              <Grid
                                className={
                                  this.props.settings &&
                                    this.props.settings.setting &&
                                    this.props.settings.setting.mode &&
                                    this.props.settings.setting.mode === "dark"
                                    ? "darkTheme addSpeclContnt"
                                    : "addServContnt"
                                }
                              // className="addServContnt"
                              >
                                <Grid className="addSpeclContntIner">
                                  <Grid className="addSpeclLbl">
                                    <Grid
                                      container
                                      direction="row"
                                      justify="center"
                                    >
                                      <Grid item xs={8} md={8} lg={8}>
                                        <label>{Addnewservice}</label>
                                      </Grid>
                                      <Grid item xs={4} md={4} lg={4}>
                                        <Grid>
                                          <Grid className="entryCloseBtn">
                                            <a
                                              onClick={() =>
                                                handleCloseServ(this)
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
                                      </Grid>
                                    </Grid>
                                  </Grid>

                                  <Grid className="enterServMain">
                                    <Grid className="enterSpcl enterSpclSec">
                                      <Grid>
                                        <VHfield
                                          label={Servicename}
                                          name="title"
                                          placeholder={EnterServicename}
                                          onChange={(e) =>
                                            updateEntryState1(e, this)
                                          }
                                          value={this.state.updateTrack.title}
                                        />
                                      </Grid>

                                      <Grid>
                                        <VHfield
                                          label={Serviceshortdescription}
                                          name="description"
                                          placeholder={
                                            Enterserviceshortdescription
                                          }
                                          onChange={(e) =>
                                            updateEntryState1(e, this)
                                          }
                                          value={
                                            this.state.updateTrack.description
                                          }
                                        />
                                      </Grid>


                                      <label className="specbutton1">
                                        {speciality}
                                      </label>

                                      <Grid className="sevicessection serviceallSec serviceallSec1">
                                        <Select
                                          onChange={(e) =>
                                            onFieldChange(e, this)
                                          }
                                          options={this.state.AllSpeciality}
                                          name="specialty_name"
                                          isSearchable={true}
                                          className="addStafSelect"
                                          isMulti={true}
                                          value={selectedID(
                                            this.state.updateTrack.specialty_id,
                                            this
                                          )}
                                        />
                                      </Grid>
                                      <Grid className='enterSpcl' >
                                        <label>{Price}</label>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        className="enterPricePart1"
                                      >
                                        <input
                                          type="number"
                                          name="price"
                                          className="serchInput"
                                          placeholder={Enterserviceprice}
                                          onChange={(e) =>
                                            updateEntryState1(e, this)
                                          }
                                          value={
                                            this.state.updateTrack.price || 0
                                          }
                                        />
                                        <p className="enterPartprice">€</p>
                                      </Grid>
                                    </Grid>

                                    <div className="err_message">
                                      {this.state.errorMsg}
                                    </div>
                                  </Grid>
                                  <Grid className="servSaveBtn">
                                    <a>
                                      <Button
                                        onClick={() => handleSubmit(this)}
                                        disabled={this.state.isButtonDisabled}

                                      >
                                        {save_and_close}
                                      </Button>
                                    </a>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Modal>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="breadCrumbUpr">
                      <Grid container direction="row" alignItems="center">
                        <Grid item xs={12} md={12}>
                          <Grid className="certificatePrice allCertSec">
                            {/* <a> */}

                            <Grid>
                              <label>{Sick_Certificate_Amount}</label>
                            </Grid>

                            <Grid
                              className={
                                this.state.sickamount1.amount >= 21 ||
                                  this.state.sickamount1.amount <= 9
                                  ? "fixedEuroSec"
                                  : "fixedEuro"
                              }
                            >
                              <input
                                type="number"
                                onKeyDown={this.onSickamount}
                                placeholder=""
                                name="amount"
                                disabled={this.state.sickamount}
                                onChange={(e) => this.updateEntryState2(e)}
                                value={this.state.sickamount1.amount}
                                min="10"
                                max="20"
                              />
                              <p className="euroamount">€</p>
                            </Grid>
                            {roles.includes('change_sc_amount') &&
                              <Grid>
                                <img
                                  className="pionter"
                                  src={require("assets/virtual_images/pencil-1.svg")}
                                  alt=""
                                  title=""
                                  onClick={() => {
                                    this.setState({
                                      sickamount: false,
                                    });
                                  }}
                                />
                              </Grid>}

                            {/* </a> */}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Start of Bread Crumb */}
                    <Grid className="breadCrumbUpr">
                      <Grid container direction="row" alignItems="center">
                        <Grid item xs={12} md={9}>
                          <Grid className="roomBreadCrumb medcalCntr">
                            <ul>
                              <li>
                                <a>
                                  <label>{Services}</label>
                                </a>
                              </li>
                              {/* <li>
                                <a>
                                  <label>Speciality Services</label>
                                </a>
                              </li> */}
                            </ul>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Grid className="settingInfo">
                            {this.state.showinput && (
                              <input
                                name="Search"
                                placeholder={Search}
                                value={this.state.SearchValue}
                                className="serchInput"
                                onChange={(e) => searchFilter(e, this)}
                              />
                            )}
                            <a>
                              {!this.state.showinput ? (
                                <img
                                  src={require("assets/virtual_images/search-entries.svg")}
                                  alt=""
                                  title=""
                                  onClick={() => {
                                    this.setState({
                                      showinput: !this.state.showinput,
                                    });
                                  }}
                                />
                              ) : (
                                <img
                                  src={require("assets/images/close-search.svg")}
                                  alt=""
                                  title=""
                                  onClick={() => {
                                    this.setState({
                                      showinput: !this.state.showinput,
                                      SearchValue: "",
                                    });
                                    getAllServices(this);
                                  }}
                                />
                              )}
                            </a>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* End of Bread Crumb */}
                    <Grid className="cardioGrup">
                      <Grid className="cardioGrupBtn">
                        <Button
                          onClick={() => {
                            getSpecialtyData(false, this);
                          }}
                          className={
                            !this.state.speciality_id ? "cardioActv" : ""
                          }
                          variant="contained"
                        >
                          {all}
                        </Button>
                        <Button
                          onClick={() => {
                            getSpecialtyData("general", this);
                          }}
                          className={
                            this.state.speciality_id === "general"
                              ? "cardioActv"
                              : ""
                          }
                          variant="contained"
                        >
                          {General}
                        </Button>
                        {this.state.AllSpeciality?.length > 0 &&
                          this.state.AllSpeciality.map((item) => (
                            <Button
                              onClick={() => {
                                getSpecialtyData(item.value, this);
                              }}
                              className={
                                this.state.speciality_id === item.value
                                  ? "cardioActv"
                                  : ""
                              }
                              variant="contained"
                            >
                              {item.label}
                            </Button>
                          ))}
                      </Grid>
                    </Grid>

                    {/* service price content */}
                    <Grid className="srvcTable3">
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>{srvc}</Th>
                            <Th>{Price}</Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {services_data?.length > 0 &&
                            services_data.map((data) => (
                              <>
                                <Tr>
                                  <Td>
                                    <label>{data.title}</label>
                                    <p>{data.description}</p>
                                  </Td>
                                  <Td>{data.price} €</Td>
                                  {/* <Td className="srvcDots"> */}
                                  <Td>
                                    {(roles.includes("edit_service") || roles.includes("delete_service")) &&

                                      <Grid
                                        item
                                        xs={6}
                                        md={6}
                                        className="spcMgntRght7 presEditDot scndOptionIner scndOptionInerPart"
                                      >
                                        <a className="openScndhrf">
                                          <img
                                            src={require("assets/images/three_dots_t.png")}
                                            alt=""
                                            title=""
                                            className="openScnd specialuty-more"
                                          />
                                          <ul>
                                            {roles.includes("edit_service") &&
                                              <li
                                                onClick={() => {
                                                  EditService(data, this);
                                                }}
                                              >
                                                <a>
                                                  <img
                                                    src={require("assets/virtual_images/pencil-1.svg")}
                                                    alt=""
                                                    title=""
                                                  />
                                                  {editService}
                                                </a>
                                              </li>
                                            }
                                            {roles.includes("delete_service") &&
                                              <li
                                                onClick={() => {
                                                  this.removeServices(data._id);
                                                }}
                                              >
                                                <a>
                                                  <img
                                                    src={require("assets/images/cancel-request.svg")}
                                                    alt=""
                                                    title=""
                                                  />
                                                  {deleteService}
                                                </a>
                                              </li>
                                            }
                                            {/* 
                                          <li
                                            onClick={() => {
                                              EditAssignedService(data, this);
                                            }}
                                          >
                                            <a>
                                              <img
                                                src={require("assets/virtual_images/pencil-1.svg")}
                                                alt=""
                                                title=""
                                              />
                                              {edit_assigned_services}
                                            </a>
                                          </li> */}

                                            {/* <li
                                            onClick={() => {
                                              this.removeServices(data._id);
                                            }}
                                          >
                                            <a>
                                              <img
                                                src={require("assets/images/cancel-request.svg")}
                                                alt=""
                                                title=""
                                              />
                                              {delete_assigned_services}
                                            </a>
                                          </li> */}
                                          </ul>
                                        </a>
                                      </Grid>
                                    }
                                  </Td>
                                </Tr>
                              </>
                            ))}
                        </Tbody>
                      </Table>

                      <Grid className="tablePagNum">
                        <Grid container direction="row">
                          <Grid item xs={12} md={6}>
                            <Grid className="totalOutOff">
                            {(this.state.currentPage && this.state.totalPage) ?(
                                  <a>
                                    {this.state.currentPage} of{" "}
                                    {this.state.totalPage}
                                  </a>) :(<div className="err_message">{no_data_avlbl}</div>)
                                }
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {this.state.totalPage > 1 && (
                              <Grid className="prevNxtpag">
                                <Pagination
                                  totalPage={this.state.totalPage}
                                  currentPage={this.state.currentPage}
                                  pages={this.state.pages}
                                  onChangePage={(page) => {
                                    onChangePage(page, this);
                                  }}
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* end of service price content */}
                  </Grid>
                </Grid>
                {/* End of Right Section */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    verifyCode,
    House,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    authy,
    houseSelect,
  })(Index)
);
