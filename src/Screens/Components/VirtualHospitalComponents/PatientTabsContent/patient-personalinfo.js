/*global google*/
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import ReactFlagsSelect from "react-flags-select";
import sitedata from "sitedata";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { OptionList } from "Screens/Login/metadataaction";
import QRCode from "qrcode.react";
import { houseSelect } from "Screens/VirtualHospital/Institutes/selecthouseaction";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import npmCountryList from "react-select-country-list";
import { Table } from "reactstrap";
import * as AustraliaC from "Screens/Components/insuranceCompanies/australia.json";
import * as AustriaC from "Screens/Components/insuranceCompanies/austria.json";
import * as NetherlandC from "Screens/Components/insuranceCompanies/dutch.json";
import * as GermanC from "Screens/Components/insuranceCompanies/german.json";
import * as PhillipinesC from "Screens/Components/insuranceCompanies/phillippines.json";
import * as SwitzerlandC from "Screens/Components/insuranceCompanies/switzerland.json";
import * as AmericaC from "Screens/Components/insuranceCompanies/us.json";
import * as ThailandC from "Screens/Components/insuranceCompanies/thailand.json";
import { LanguageFetchReducer } from "Screens/actions";
import Modal from "@material-ui/core/Modal";
import SPECIALITY from 'speciality';
import Loader from "Screens/Components/Loader/index";
import { GetLanguageDropdown,  GetShowLabel1, } from "Screens/Components/GetMetaData/index.js";
import DateFormat from "Screens/Components/DateFormat/index";
import { getLanguage } from "translations/index";
import { commonHeader, commonCometHeader } from "component/CommonHeader/index";
var datas = [];
var insurances = [];

class Index extends Component {
  constructor(props) {
    super(props);
    this.filterList = this.filterList.bind(this);
    this.state = {
      date: new Date(),
      userDetails: [],
      language: [],
      speciality: [],
      languageData: [],
      specialityData: [],
      title_degreeData: [],
      subspeciality: [],
      UpDataDetails: [],
      speciality_multi: [],
      insurance_count: 1,
      insuranceDetails: {},
      insurancefull: [],
      loaderImage: false,
      city: "",
      moreone: false,
      selectCountry: [],
      flag_fax: "DE",
      flag_phone: "DE",
      flag_mobile: "DE",
      flag_emergency_number: "DE",
      mobile: "",
      phone: "",
      fax: "",
      emergency_number: "",
      updateIns: -1,
      succUpdate: false,
      copied: false,
      value: 0,
      qrOpen: false,
      addInsuranceOpen: false,
      editInsuranceOpen: false,
      editInsuData: {},
      insurnanceAdded: false,
      selectedCountry: {},
      q: "",
      filteredCompany: [],
      editIndex: null,
      insu1: false,
      contact_partner: {},
    };
    // new Timer(this.logOutClick.bind(this))
  }

  // On change the Birthday
  onChange = (date) => {
    const state = this.state.UpDataDetails;
    state["birthday"] = date;
    this.setState({ UpDataDetails: state });
  };
  handlePinClose = (key) => {
    this.setState({ [key]: false });
  };

  componentDidMount() {
    this.getMetadata();
    this.getUserData();
    var npmCountry = npmCountryList().getData()
    this.setState({ selectCountry: npmCountry })
  }

      //get list of list
      getMetadata = () => {
        this.setState({ allMetadata: this.props.metadata },
          () => {  this.GetLanguageMetadata(); })
    }

  GetLanguageMetadata = () => {
      var Allgender = GetLanguageDropdown(this.state.allMetadata && this.state.allMetadata.gender && this.state.allMetadata.gender.length > 0 && this.state.allMetadata.gender, this.props.stateLanguageType)
      var rhesusgroup = GetLanguageDropdown(this.state.allMetadata && this.state.allMetadata.rhesus && this.state.allMetadata.rhesus.length > 0 && this.state.allMetadata.rhesus, this.props.stateLanguageType)
      let AllMaritalOption = GetLanguageDropdown(this.state.allMetadata && this.state.allMetadata.maritalStatus && this.state.allMetadata.maritalStatus.length > 0 && this.state.allMetadata.maritalStatus, this.props.stateLanguageType)
      this.setState({
          AllMaritalOption: AllMaritalOption,
          genderdata: Allgender,
          languageData: this.state.allMetadata && this.state.allMetadata.languages && this.state.allMetadata.languages.length > 0 && this.state.allMetadata.languages,
          specialityData: GetLanguageDropdown(SPECIALITY.speciality.english, this.props.stateLanguageType),
          title_degreeData: this.state.allMetadata && this.state.allMetadata.title_degreeData && this.state.allMetadata.title_degreeData.length > 0 && this.state.allMetadata.title_degreeData,
          bloodgroup: this.state.allMetadata && this.state.allMetadata.bloodgroup && this.state.allMetadata.bloodgroup.length > 0 && this.state.allMetadata.bloodgroup,
          rhesusgroup: rhesusgroup,
          handleMaritalStatus: AllMaritalOption
      });
  }
  // Copy the Profile id and PIN
  copyText = (copyT) => {
    console.log('copyT', copyT)
    this.setState({ copied: false });
    var copyText = document.getElementById(copyT);
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 5000);
  };

  //For update the mobile number
  updateMOBILE = (str) => {
    if (!str || str === "undefined" || str === null || str === "") {
      return str;
    } else {
      var mob = str && str.split("-");
      return mob.pop();
    }
  };

  // fOR update the flag of mobile
  updateFLAG = (str) => {
    var mob = str && str.split("-");
    if (mob && mob.length > 0) {
      if (mob[0] && mob[0].length == 2) {
        return mob[0];
      } else {
        return "DE";
      }
    }
  };
  //For open QR code
  handleQrOpen = () => {
    this.setState({ qrOpen: true });
  };
  handleQrClose = () => {
    this.setState({ qrOpen: false });
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.stateLanguageType !== this.props.stateLanguageType) {
      if (this.state.rhesus && this.state.rhesus) {
        this.Upsaterhesus(this.state.rhesus);
      }
    }
  };

  // For add the insurance
  addmore_insurance() {
    datas.push(this.state.insuranceDetails);
    this.setState({
      insurance_count: this.state.insurance_count + 1,
      insurancefull: datas,
    });
    this.setState({
      insuranceDetails: {
        insurance: "",
        insurance_type: "",
        insurance_number: "",
      },
    });
    this.setState({ moreone: true });
  }

  //Save the User profile
  saveUserData1 = () => {
    if (
      this.state.insuranceDetails.insurance !== "" &&
      this.state.insuranceDetails.insurance_country !== ""
    ) {
      if (
        datas.some(
          (data) => data.insurance === this.state.insuranceDetails.insurance
        )
      ) {
      } else {
        datas.push(this.state.insuranceDetails);
        this.setState({ insurancefull: datas });
      }
      const user_token = this.props.stateLoginValueAim.token;
      this.setState({ insu1: false, loaderImage: true });
      axios
        .put(
          sitedata.data.path +
          "/UserProfile/Users/update/" +
          this.props.match.params.id,
          {
            insurance: datas,
          },
          commonHeader(user_token)
        )
        .then((responce) => {
          if (responce.data.hassuccessed) {
            this.setState({
              editInsuranceOpen: false,
              addInsuranceOpen: false,
              succUpdate: true,
              insuranceDetails: {
                insurance: "",
                insurance_number: "",
                insurance_country: "",
              },
            });
            this.setState({ loaderImage: false });
            setTimeout(() => {
              this.setState({ succUpdate: false });
            }, 5000);
            this.getUserData();
          }
        });
    } else {
      this.setState({ insu1: true });
    }
  };

  //For open the Insurance Edit popup
  editKYCopen(event, i) {
    this.setState({
      editInsuranceOpen: true,
      insuranceDetails: event,
      editIndex: i,
    });
  }

  //For update the insurance country
  updatesinsurancesCountry(keys, e) {
    datas[keys].insurance_country = e.value;
    this.setState({ insurancefull: datas });
  }

  //Update Insurance
  updatesinsurances = (keys, e) => {
    if (e.target.name === "insurance") {
      datas[keys].insurance = e.target.value;
      const q = e.target.value.toLowerCase();
      this.setState({ q }, () =>
        this.filterList(datas[keys].insurance_country)
      );
      this.setState({ updateIns: keys });
    }
    if (e.target.name === "insurance_number") {
      datas[keys].insurance_number = e.target.value;
    }
    this.setState({ insurancefull: datas });
  };

  //For removing the insurance
  removeInsurance = (keys, e) => {
    datas.splice(keys, 1);
    this.setState({ insurancefull: datas }, () => {
      axios
        .put(
          sitedata.data.path +
          "/UserProfile/Users/update/" +
          this.props.match.params.id,
          {
            insurance: datas,
          },
          commonHeader(this.props.stateLoginValueAim.token)
        )
        .then((responce) => {
          if (responce.data.hassuccessed) {
            this.setState({
              editInsuranceOpen: false,
              addInsuranceOpen: false,
              succUpdate: true,
              insuranceDetails: {
                insurance: "",
                insurance_number: "",
                insurance_country: "",
              },
            });
            this.setState({ loaderImage: false });
            setTimeout(() => {
              this.setState({ succUpdate: false });
            }, 5000);
            this.getUserData();
          }
        });
    });
  };

  Upsaterhesus = (rhesusfromD) => {
    var rhesus = GetShowLabel1(this.state.rhesusgroup, rhesusfromD, this.props.stateLanguageType, false, "rhesus");
    this.setState({ rhesus: rhesus })
  };

  //For getting User Data
  getUserData() {
    this.setState({ loaderImage: true });
    let user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.match.params.id;
    axios
      .get(
        sitedata.data.path + "/UserProfile/Users/" + user_id,
        commonHeader(user_token)
      )
      .then((response) => {
        var state1 = this.state.contact_partner;
        state1["relation"] =
          response.data.data && response.data.data.emergency_relation;
        state1["email"] =
          response.data.data && response.data.data.emergency_email;
        state1["name"] =
          response.data.data && response.data.data.emergency_contact_name;
        state1["number"] =
          response.data.data && response.data.data.emergency_number;
        this.setState({ contact_partner: state1 }, () => {
          if (
            response.data.data &&
            response.data.data.emergency_number &&
            response.data.data.emergency_number !== ""
          ) {
            let fen = response.data.data.emergency_number.split("-");
            if (fen && fen.length > 0) {
              this.setState({ flag_emergency_number: fen[0] });
            }
          }
        });
        var title = {},
          titlefromD = response.data.data.title;
        var bloodfromD = response.data.data.blood_group,
          rhesusfromD = response.data.data.rhesus,
          bloods = {};
        var language = [],
          languagefromD = response.data.data.language;
        if (languagefromD && languagefromD.length > 0) {
          languagefromD.map((item) => {
            language.push({ value: item, label: item.replace(/_/g, " ") });
          });
        }

        if (bloodfromD && bloodfromD !== "") {
          if(typeof bloodfromD === 'object') {
              bloods =  bloodfromD;
              }else{
                  bloods = { label: bloodfromD, value: bloodfromD }
              }
        }
        if (rhesusfromD && rhesusfromD !== "") {
          this.Upsaterhesus(rhesusfromD);
        }
        if (titlefromD && titlefromD !== "") {
          title = { label: titlefromD, value: titlefromD };
        }
        if (response.data.data.mobile && response.data.data.mobile !== "") {
          let mob = response.data.data.mobile.split("-");
          if (mob && mob.length > 0) {
            this.setState({ flag_mobile: mob[0] });
          }
        }
        if (response.data.data.phone && response.data.data.phone !== "") {
          let pho = response.data.data.phone.split("-");
          if (pho && pho.length > 0) {
            this.setState({ flag_phone: pho[0] });
          }
        }
        if (response.data.data.fax && response.data.data.fax !== "") {
          let fx = response.data.data.fax.split("-");
          if (fx && fx.length > 0) {
            this.setState({ flag_fax: fx[0] });
          }
        }
        this.setState({
          UpDataDetails: response.data.data,
          city: response.data.data.city,
          area: response.data.data.area,
          profile_id: response.data.data.profile_id,
        });
        this.setState({
          speciality_multi: this.state.UpDataDetails.speciality,
        });
        this.setState({ name_multi: language, title: title, bloods: bloods });
        this.setState({
          insurancefull: this.state.UpDataDetails.insurance,
          insuranceDetails: {
            insurance: "",
            insurance_number: "",
            insurance_type: "",
          },
        });
        datas = this.state.UpDataDetails.insurance;

        this.setState({ loaderImage: false });
      })
      .catch((error) => {
        this.setState({ loaderImage: false });
      });
  }

  //For updating gender and country
  EntryValueName = (value, name) => {
    if(name === 'title'){
      this.setState({ title: value });
  }
  if(name === 'blood_group'){
      this.setState({ bloods: value });
  }
  if(name === 'rhesus'){
      this.setState({ rhesus: value });
  }
  const state = this.state.UpDataDetails;
  state[name] = value;
  this.setState({ UpDataDetails: state });
  };

  //Calling when city is updated
  updateEntryCity = (place) => {
    this.setState({ city: place.formatted_address });
    this.setState({
      area: {
        type: "Point",
        coordinates: [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ],
      },
    });
    const state = this.state.UpDataDetails;
    state["city"] = place.formatted_address;
    this.setState({ UpDataDetails: state });
  };

  // For update full insurance
  updateInsurancee = (e) => {
    if (e.target.name === "insurance") {
      const q = e.target.value.toLowerCase();
      this.setState({ q }, () =>
        this.filterList(this.state.insuranceDetails.insurance_country)
      );
      this.setState({ updateIns: -2 });
    }
    const state = this.state.insuranceDetails;
    state[e.target.name] = e.target.value;
    this.setState({ insuranceDetails: state });
  };

  // For Add more insurance model
  handleAddInsurance = () => {
    this.setState({ addInsuranceOpen: true });
  };

  //To add Insurance
  insuranceForm = (e) => {
    const state = this.state.insuranceDetails;
    if (e.target.name == "insurance") {
      const q = e.target.value.toLowerCase();
      this.setState({ q }, () =>
        this.filterList(this.state.insuranceDetails.insurance_country)
      );
    }
    state[e.target.name] = e.target.value;
    this.setState({ insuranceDetails: state });
  };

  selectCountry = (event) => {
    const state = this.state.insuranceDetails;
    state["insurance_country"] = event.value;
    this.setState({ insuranceDetails: state });
    this.setState({ selectedCountry: event });
  };

  //For insurance Countries getting the list
  filterList(data) {
    let iCompany;
    switch (data) {
      case "AU":
        iCompany = AustraliaC.australia;
        break;
      case "AT":
        iCompany = AustriaC.austria;
        break;
      case "US":
        iCompany = AmericaC.us;
        break;
      case "NL":
        iCompany = NetherlandC.dutch;
        break;
      case "DE":
        iCompany = GermanC.german;
        break;
      case "PH":
        iCompany = PhillipinesC.phillippines;
        break;
      case "CH":
        iCompany = SwitzerlandC.switzerland;
        break;
      case "TH":
        iCompany = ThailandC.thailand;
        break;
    }
    let q = this.state.q;
    iCompany =
      iCompany &&
      iCompany.length > 0 &&
      iCompany.filter(function (company) {
        const companyLower = company.toLowerCase();
        return companyLower.indexOf(q) != -1;
      });
    this.setState({ filteredCompany: iCompany });
    if (this.state.q == "") {
      this.setState({ filteredCompany: [] });
    }
  }

  toggle = (event) => {
    const state = this.state.insuranceDetails;
    state["insurance"] = event;
    this.setState({ insuranceDetails: state });
    if (this.state.active === event) {
      this.setState({ active: null });
    } else {
      this.setState({ active: event });
    }
  };

  //For filter the country for add insuance
  filterCountry = (i) => {
    let countryList = this.state.selectCountry;
    let name;
    name = countryList.filter((value) => {
      if (value.value == i) {
        return value.label;
      }
    });
    return name[0]?.label;
  };

  //For filter the country for add insuances
  filterCountry1 = (i) => {
    let countryList = this.state.selectCountry;
    let name;
    name = countryList.filter((value) => {
      if (value.value == i) {
        return value.label;
      }
    });
    return name[0];
  };

  render() {
    const { value, editInsuData, insurancefull, editIndex, insuranceDetails } =
    this.state;
    const companyList =
      this.state.filteredCompany &&
      this.state.filteredCompany.map((company) => {
        return (
          <li
            className="list-group-item"
            value={company}
            onClick={() => {
              this.setState({ q: company });
              this.toggle(company);
              this.setState({ filteredCompany: [] });
            }}
          >
            {company}
          </li>
        );
      });

    let translate = getLanguage(this.props.stateLanguageType);
    let {
      phone, select_marital_status,
      marital_status, Rhesus, InsurancecompanyError,
      Addcompany,
      Blood, 
      profile,
      ID, pin, QR_code,
      done,
      edit,
      save_change,
      email,
      title,
      degree,
      first,
      last, name,
      dob, gender, street, add, city, postal_code,
      country,
      home_telephone,
      country_code,
      Delete,
      male,
      female,
      other,
      mobile_number,
      number,
      mobile,
      Languages, spoken,
      insurance,
      add_more,
      company,
      of, PersonalInformation,
      insurance_added,
      Country_Code
    } = translate;

    return (
      <Grid
      className={
          this.props.settings &&
              this.props.settings.setting &&
              this.props.settings.setting.mode &&
              this.props.settings.setting.mode === "dark"
              ? "homeBg darkTheme homeBgDrk"
              : "homeBg"
            }
        >
        {this.state.loaderImage && <Loader />}
        <Grid className="journalAdd">
       
          <Grid container direction="row">
            <Grid item xs={12} md={11}>
              <Grid container direction="row">
                <Grid item xs={12} md={12} sm={12}>
                  <h1>{PersonalInformation}</h1>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* QR Model setup */}
        <Modal
          open={this.state.qrOpen}
          onClose={this.handleQrClose}
          className={
            this.props.settings &&
              this.props.settings.setting &&
              this.props.settings.setting.mode === "dark"
              ? "darkTheme qrBoxModel"
              : "qrBoxModel"
          }
        >
          <Grid className="qrBoxCntnt">
            <Grid className="qrCourse">
            <Grid container direction="row" justify="center">
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={8} md={8} lg={8}>
                      <label>{profile} {QR_code}</label>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <Grid>
                        <Grid className="entryCloseBtn">
                        <a onClick={this.handleQrClose}>
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
              {/* <Grid className="qrCloseBtn">
                <a onClick={this.handleQrClose}>
                  <img
                    src={require("assets/images/close-search.svg")}
                    alt=""
                    title=""
                  />
                </a>
              </Grid>
              <Grid>
                <label>
                  {profile} {QR_code}
                </label>
              </Grid> */}
            </Grid>
            <Grid className="qrCourseImg">
              <Grid>
                {" "}
                <QRCode
                  value={
                    this.state.UpDataDetails &&
                    this.state.UpDataDetails.profile_id
                  }
                />
              </Grid>
              <Grid>
                <input
                  type="submit"
                  value={done}
                  onClick={this.handleQrClose}
                />
              </Grid>
            </Grid>
          </Grid>
        </Modal>
        {/* End of QR Model setup */}
        {/* Patient Personal Info */}
        <Grid container direction="row">
          <Grid item xs={12} md={11}>
            <Grid className="profilePkgIner2">
              <Grid className="profileId">
                <Grid container direction="row" alignItems="center">
                  <Grid item xs={12} md={9}>
                    <Grid className="profileIdLft">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item xs={12} md={7}>
                          <label>
                            {profile} {ID}
                          </label>
                          <span id="profile_id">
                            {this.state.UpDataDetails.alies_id &&
                              this.state.UpDataDetails.alies_id}
                          </span>
                          <a>
                            <img
                              src={require("assets/images/copycopy.svg")}
                              onClick={() => this.copyText("profile_id")}
                              alt=""
                              title=""
                            />
                          </a>
                          <a>
                            <img
                              src={require("assets/images/qr-code.svg")}
                              onClick={this.handleQrOpen}
                              alt=""
                              title=""
                            />
                          </a>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <label>{pin}</label>
                          <span id="profile_pin">
                            {this.state.UpDataDetails.pin &&
                              this.state.UpDataDetails.pin}
                          </span>
                          <a>
                            <img
                              src={require("assets/images/copycopy.svg")}
                              onClick={() => this.copyText("profile_pin")}
                              alt=""
                              title=""
                            />
                          </a>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={3}></Grid>
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={12} md={8}>
                  <Grid className="profileInfo">
                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={12}>
                          <label>{email}</label>
                          <Grid>
                            <input
                              name="email"
                              type="text"
                              disabled={true}
                              value={this.state.UpDataDetails.email}
                              // disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner titleDegre">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={3}>
                          <label>
                            {title} / {degree}
                          </label>
                          <Grid>
                            <Select
                              value={this.state.title}
                              options={this.state.title_degreeData}
                              isDisabled={true}
                              placeholder={"Mr."}
                              name="title"
                              isSearchable={false}
                              className="mr_sel"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <label>
                            {first} {name}
                          </label>
                          <Grid>
                            <input
                              type="text"
                              disabled={true}
                              name="first_name"
                              value={this.state.UpDataDetails.first_name}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <label>
                            {last} {name}
                          </label>
                          <Grid>
                            <input
                              type="text"
                              disabled={true}
                              name="last_name"
                              value={this.state.UpDataDetails.last_name}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoDate">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={4}>
                          <label>{dob}</label>
                          <Grid>

                            <DateFormat
                              disabled={true}
                              name="birthday"
                              value={
                                this.state.UpDataDetails.birthday
                                  ? new Date(this.state.UpDataDetails.birthday)
                                  : new Date()
                              }
                              onChange={this.onChange}
                              date_format={
                                this.props.settings.setting &&
                                this.props.settings.setting.date_format
                              }
                             
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <label>{gender}</label>
                          <Grid>
                            <a
                              className={
                                this.state.UpDataDetails.sex &&
                                this.state.UpDataDetails.sex === "male" &&
                                "SelectedGender"
                              }
                            >
                              {male}
                            </a>
                            <a
                              className={
                                this.state.UpDataDetails.sex &&
                                this.state.UpDataDetails.sex === "female" &&
                                "SelectedGender"
                              }
                            >
                              {female}
                            </a>
                            <a
                              className={
                                this.state.UpDataDetails.sex &&
                                this.state.UpDataDetails.sex === "other" &&
                                "SelectedGender"
                              }
                            >
                              {" "}
                              {other}
                            </a>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>{marital_status}</label>
                          <Grid className="cntryDropTop">
                            <Select
                              placeholder={select_marital_status}
                              options={this.state.AllMaritalOption}
                              value={
                                this.state.UpDataDetails &&
                                this.state.UpDataDetails.marital_status &&
                                GetShowLabel1(
                                  this.state.handleMaritalStatus,
                                  this.state.UpDataDetails.marital_status.value,
                                  this.props.stateLanguageType
                                )
                              }
                              className="cntryDrop"
                              isDisabled={true}
                            // value ={this.state.UpDataDetails && this.state.UpDataDetails.marital_status && GetShowLabel(this.state.UpDataDetails.marital_status, this.props.stateLanguageType)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>
                            {street} {add}
                          </label>
                          <Grid>
                            <input
                              type="text"
                              disabled={true}
                              name="address"
                              value={
                                this.state.UpDataDetails.address
                                  ? this.state.UpDataDetails.address
                                  : ""
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>{city}</label>
                          <Grid>
                            <input
                              type="text"
                              disabled={true}
                              name="pastal_code"
                              value={this.state.city}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <label>{postal_code}</label>
                          <Grid>
                            <input
                              type="text"
                              disabled={true}
                              name="pastal_code"
                              value={
                                this.state.UpDataDetails.pastal_code
                                  ? this.state.UpDataDetails.pastal_code
                                  : ""
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>{country}</label>
                          <Grid className="cntryDropTop">
                            <Select
                              value={this.state.UpDataDetails.country}
                              onChange={(e) =>
                                this.EntryValueName(e, "country")
                              }
                              options={this.state.selectCountry}
                              placeholder=""
                              isSearchable={true}
                              isDisabled={true}
                              name="country"
                              className="cntryDrop"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}></Grid>
                        <Grid className="clear"></Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>{home_telephone}</label>
                          <Grid>
                            {this.updateFLAG(this.state.UpDataDetails.phone) &&
                              this.updateFLAG(
                                this.state.UpDataDetails.phone
                              ) !== "" && (
                                <ReactFlagsSelect
                                  disabled
                                  searchable={true}
                                  placeholder={country_code}
                                  name="flag_phone"
                                  showSelectedLabel={false}
                                  defaultCountry={this.updateFLAG(
                                    this.state.UpDataDetails.phone
                                  )}
                                />
                              )}
                            <input
                              type="text"
                              className="Mobile_extra"
                              placeholder={phone}
                              disabled={true}
                              name="phone"
                              onChange={this.updateEntryState1}
                              value={
                                this.state.UpDataDetails.phone &&
                                this.updateMOBILE(
                                  this.state.UpDataDetails.phone
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}></Grid>
                        <Grid className="clear"></Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>{mobile_number}</label>
                          <Grid>
                            {this.updateFLAG(this.state.UpDataDetails.mobile) &&
                              this.updateFLAG(
                                this.state.UpDataDetails.mobile
                              ) !== "" && (
                                <ReactFlagsSelect
                                  disabled
                                  searchable={true}
                                  placeholder={Country_Code}
                                  name="flag_mobile"
                                  showSelectedLabel={false}
                                  defaultCountry={this.updateFLAG(
                                    this.state.UpDataDetails.mobile
                                  )}
                                />
                              )}
                            <input
                              type="text"
                              className="Mobile_extra"
                              placeholder={mobile}
                              name="mobile"
                              disabled={true}
                               onChange={this.updateEntryState1}
                              value={
                                this.state.UpDataDetails.mobile &&
                                this.updateMOBILE(
                                  this.state.UpDataDetails.mobile
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}></Grid>
                        <Grid className="clear"></Grid>
                      </Grid>
                    </Grid>

                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={8}>
                          <label>
                            {Languages} {spoken}
                          </label>
                          <Grid className="cntryDropTop">
                            <Select
                              value={this.state.name_multi}
                              name="languages"
                              closeMenuOnSelect={false}
                              options={this.state.languageData}
                              placeholder=""
                              isSearchable={true}
                              isDisabled={true}
                              className="profile-language"
                              isMulti={true}
                              // className="cntryDrop"
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}></Grid>
                        <Grid className="clear"></Grid>
                      </Grid>
                    </Grid>
                    <Grid className="profileInfoIner">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item xs={12} md={4}>
                          <label>{Blood}</label>
                          <Grid className="cntryDropTop">
                          <Select
                              value={this.state.bloods}
                              name="bloodgroup"
                              onChange={(e) => { this.EntryValueName(e, 'blood_group') }}
                              options={this.state.bloodgroup}
                              placeholder=""
                              isSearchable={false}
                              isDisabled={true}
                              className="profile-language"
                              // className="cntryDrop"
                          />
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <label>{Rhesus}</label>
                          <Grid className="cntryDropTop">
                              <Select
                                  value={this.state.rhesus}
                                  name="rhesus"
                                  onChange={(e) => {this.EntryValueName(e, 'rhesus') }}
                                  options={this.state.rhesusgroup}
                                  placeholder=""
                                  isSearchable={false}
                                  isDisabled={true}
                                  className="profile-language"
                                  // className="cntryDrop"
                              />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}></Grid>
                        <Grid className="clear"></Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}></Grid>
                <Grid className="clear"></Grid>
              </Grid>
              <Grid className="insrnceTbl">
                <Grid>
                  <h3>{insurance}</h3>
                </Grid>
                <Grid className="profileIdRght">
                  <a onClick={this.handleAddInsurance}>{Addcompany}</a>
                </Grid>
                {/* Add more insurance model Open */}
                <Modal
                  open={this.state.addInsuranceOpen}
                  onClose={() => this.handlePinClose("addInsuranceOpen")}
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode === "dark"
                      ? "darkTheme editBoxModel"
                      : "editBoxModel"
                  }
                >
                  <Grid className="editBoxCntnt">
                    <Grid className="editCourse">
                    <Grid container direction="row" justify="center">
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={8} md={8} lg={8}>
                      <label>{add_more} {insurance}</label>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <Grid>
                        <Grid className="entryCloseBtn">
                        <a  onClick={() =>
                            this.handlePinClose("addInsuranceOpen")
                          }>
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
                      {/* <Grid className="editCloseBtn">
                        <a
                          onClick={() =>
                            this.handlePinClose("addInsuranceOpen")
                          }
                        >
                          <img
                            src={require("assets/images/close-search.svg")}
                            alt=""
                            title=""
                          />
                        </a>
                      </Grid>
                      <Grid>
                        <label>
                          {add_more} {insurance}
                        </label>
                      </Grid> */}
                    </Grid>
                    <Grid className="editPinform">
                      <Grid className="editField">
                        {this.state.insurnanceAdded && (
                          <div className="success_message">
                            {insurance_added}
                          </div>
                        )}
                        {this.state.insu1 && (
                          <div className="err_message">
                            {InsurancecompanyError}
                          </div>
                        )}
                        <label>
                          {country} {of} {insurance}
                        </label>
                        <Grid className="cntryDropTop">
                          <Select
                            onChange={this.selectCountry}
                            options={this.state.selectCountry}
                            placeholder=""
                            isSearchable={true}
                            name="insurance_country"
                            className="cntryDrop"
                          />
                        </Grid>
                      </Grid>
                      <Grid className="editField">
                        <label>
                          {insurance} {company}
                        </label>
                        <Grid>
                          <input
                            type="text"
                            name="insurance"
                            value={
                              insuranceDetails &&
                              insuranceDetails.insurance &&
                              insuranceDetails.insurance
                            }
                            onChange={this.insuranceForm}
                          />
                        </Grid>
                        <ul
                          className="insuranceHint"
                          style={{
                            height:
                              companyList && companyList.length > 0
                                ? "150px"
                                : "",
                          }}
                        >
                          {companyList}
                        </ul>
                      </Grid>

                      <Grid className="editField">
                        <label>
                          {insurance} {number}
                        </label>
                        <Grid>
                          <input
                            type="text"
                            name="insurance_number"
                            onChange={(e) => this.insuranceForm(e)}
                          />
                        </Grid>
                      </Grid>
                      <Grid>
                        <input
                          type="submit"
                          onClick={this.saveUserData1}
                          value={save_change}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Modal>
                {/* Add more insurance model Close */}
                <Table>
                  <thead>
                    <tr>
                      <th>
                        {country} {of} {insurance}
                      </th>
                      <th>
                        {insurance} {company}
                      </th>
                      <th>
                        {insurance} {number}
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {insurancefull &&
                      insurancefull.length > 0 &&
                      insurancefull.map((insu, i) => (
                        <tr>
                          <td>{this.filterCountry(insu.insurance_country)}</td>
                          <td>{insu.insurance}</td>
                          <td>{insu.insurance_number}</td>
                          <td className="presEditDot scndOptionIner pivoted">
                            <a className="openScndhrf">
                              <img
                                src={require("assets/images/three_dots_t.png")}
                                alt=""
                                title=""
                                className="openScnd"
                              />
                              <ul>
                                <li>
                                  <a onClick={() => this.editKYCopen(insu, i)}>
                                    <img
                                      src={require("assets/images/edit.svg")}
                                      alt=""
                                      title=""
                                    />
                                    {edit}
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      this.removeInsurance(i, insu)
                                    }
                                  >
                                    <img
                                      src={require("assets/images/close-search.svg")}
                                      alt=""
                                      title=""
                                    />
                                    {Delete}
                                  </a>
                                </li>
                              </ul>
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                {/* Edit insurance model OPen */}
                <Modal
                  open={this.state.editInsuranceOpen}
                  onClose={() => this.handlePinClose("editInsuranceOpen")}
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode === "dark"
                      ? "darkTheme editBoxModel"
                      : "editBoxModel"
                  }
                >
                  <Grid className="editBoxCntnt">
                    <Grid className="editCourse">
                    <Grid container direction="row" justify="center">
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container direction="row" justify="center">
                    <Grid item xs={8} md={8} lg={8}>
                      <label>{edit} {insurance}</label>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <Grid>
                        <Grid className="entryCloseBtn">
                        <a  onClick={() =>
                            this.handlePinClose("editInsuranceOpen")
                          }>
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
                      {/* <Grid className="editCloseBtn">
                        <a
                          onClick={() =>
                            this.handlePinClose("editInsuranceOpen")
                          }
                        >
                          <img
                            src={require("assets/images/close-search.svg")}
                            alt=""
                            title=""
                          />
                        </a>
                      </Grid>
                      <Grid>
                        <label>
                          {edit} {insurance}
                        </label>
                      </Grid> */}
                    </Grid>
                    <Grid className="editPinform">
                      <Grid className="editField">
                        {this.state.insu1 && (
                          <div className="err_message">
                            {InsurancecompanyError}
                          </div>
                        )}
                        {this.state.insurnanceAdded && (
                          <div className="success_message">
                            {insurance_added}
                          </div>
                        )}
                        <label>
                          {country} {of} {insurance}
                        </label>
                        <Grid className="cntryDropTop">
                          <Select
                            value={
                              datas &&
                                datas[editIndex] &&
                                datas[editIndex].insurance_country
                                ? this.filterCountry1(
                                  datas[editIndex] &&
                                  datas[editIndex].insurance_country
                                )
                                : ""
                            }
                            onChange={(event) =>
                              this.updatesinsurancesCountry(editIndex, event)
                            }
                            options={this.state.selectCountry}
                            placeholder=""
                            isSearchable={true}
                            name="insurance_country"
                            className="cntryDrop"
                          />
                        </Grid>
                      </Grid>

                      <Grid className="editField">
                        <label>
                          {insurance} {company}
                        </label>
                        <Grid>
                          <input
                            type="text"
                            value={
                              datas &&
                                datas[editIndex] &&
                                datas[editIndex].insurance
                                ? datas[editIndex] && datas[editIndex].insurance
                                : ""
                            }
                            name="insurance"
                            onChange={(event) =>
                              this.updatesinsurances(editIndex, event)
                            }
                          />
                        </Grid>
                        <ul
                          className="insuranceHint"
                          style={{
                            height:
                              companyList && companyList.length > 0
                                ? "150px"
                                : "",
                          }}
                        >
                          {companyList}
                        </ul>
                      </Grid>

                      <Grid className="editField">
                        <label>
                          {insurance} {number}
                        </label>
                        <Grid>
                          <input
                            type="text"
                            value={
                              datas &&
                                datas[editIndex] &&
                                datas[editIndex].insurance_number
                                ? datas[editIndex] &&
                                datas[editIndex].insurance_number
                                : ""
                            }
                            name="insurance_number"
                            onChange={(event) =>
                              this.updatesinsurances(editIndex, event)
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid>
                        <input
                          type="submit"
                          onClick={this.saveUserData1}
                          value={save_change}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Modal>
                {/* Edit insurance Model close */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* End of Patient Personal Info */}
      </Grid>
    );
  }
}
const mapStateToProps = (state) => {
  const { stateLoginValueAim,loadingaIndicatoranswerdetail } = state.LoginReducerAim;
  const { stateLanguageType } = state.LanguageReducer;
  const { House } = state.houseSelect;
  const { settings } = state.Settings;
  const { metadata } = state.OptionList;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    House,
    settings,
    metadata
  };
};
export default withRouter(
  connect(mapStateToProps, {
    OptionList,
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    houseSelect,
  })(Index)
);
