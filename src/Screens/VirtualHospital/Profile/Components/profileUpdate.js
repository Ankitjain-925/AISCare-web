/*global google*/
import TextField from "@material-ui/core/TextField";
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import DatePicker from "react-date-picker";
import ReactFlagsSelect from "react-flags-select";
import sitedata from "sitedata";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Autocomplete from "Screens/Components/Autocomplete/index";
import { OptionList } from "Screens/Login/metadataaction";
import FileUploader from "Screens/Components/FileUploader/index";
import { LanguageFetchReducer } from "Screens/actions";
import Modal from "@material-ui/core/Modal";
import npmCountryList from "react-select-country-list";
import Loader from "Screens/Components/Loader/index";
import DateFormat from "Screens/Components/DateFormat/index";
import QRCode from "qrcode.react";
import { GetUrlImage1, blobToFile, resizeFile } from "Screens/Components/BasicMethod/index";
import SPECIALITY from "speciality";
import _ from 'lodash';
import { GetLanguageDropdown } from "Screens/Components/GetMetaData/index.js";
import { getLanguage } from "translations/index"
// import { update_CometUser } from "Screens/Components/CommonApi/index";
import { commonHeader, commonCometHeader } from "component/CommonHeader/index";
import contry from "Screens/Components/countryBucket/countries.json";


var datas = [];
var insurances = [];

class Index extends Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.city = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
    this.state = {
      selectedOption: null,
      openDash: false,
      date: new Date(),
      age: "",
      name: "hai",
      labelWidth: 0,
      name_multi: [],
      age: "",
      name: "hai",
      labelWidth: "",
      gender: "",
      language: [],
      userDetails: [],
      weoffer: [],
      language: [],
      speciality: [],
      uploadedimage: "",
      file: "",
      imagePreviewUrl: "",
      genderdata: [],
      languageData: [],
      specialityData: [],
      addressDetails: [],
      title_degreeData: [],
      subspeciality: [],
      UpDataDetails: [],
      speciality_multi: [],
      UpDataDetailsdicard: [],
      speciality_multidiscard: [],
      name_multidiscard: [],
      passwordDetails: [],
      loaderImage: false,
      regisError1: "",
      regisError2: "",
      city: "",
      area: "",
      allDocData: {},
      moreone: false,
      profile_id: "",
      selectCountry: [],
      flag_fax: "DE",
      flag_phone: "DE",
      flag_mobile: "DE",
      flag_emergency_number: "DE",
      mobile: "",
      phone: "",
      fax: "",
      updateIns: -1,
      error3: false,
      error4: false,
      succUpdate: false,
      copied: false,
      value: 0,
      qrOpen: false,
      chngPinOpen: false,
      ChangedPIN: false,
      DuplicateAlies: false,
      toSmall: false,
      phonevalidate: false,
      image: false,
      types: [
        { label: "nurse", value: "nurse" },
        { label: "therapist", value: "therapist" },
      ],
      UpDataDetails1: {}
    };
    // new Timer(this.logOutClick.bind(this))
  }

  // On change the Birthday
  onChange = (date) => {
    const state = this.state.UpDataDetails;
    state["birthday"] = date;
    this.setState({ UpDataDetails: state });
  };

  componentDidMount() {
    this.getMetadata();
    this.getUserData();
    /*---location---*/
    this.city = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ["geocode"] }
    );
    this.city.addListener("place_changed", this.handlePlaceChanged);
    var npmCountry = npmCountryList().getData();
    this.setState({ selectCountry: npmCountry });
  }

  // Copy the Profile id and PIN
  copyText = (copyT) => {
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

  //Update the states
  updateEntryState1 = (e) => {
    const state = this.state.UpDataDetails;
    if (e.target.name === "mobile") {
      state[e.target.name] = this.state.flag_mobile + "-" + e.target.value;
      this.setState({ mobile: e.target.value });
    }
    if (e.target.name === "fax") {
      state[e.target.name] = this.state.flag_fax + "-" + e.target.value;
      this.setState({ fax: e.target.value });
    }
    if (e.target.name === "phone") {
      state[e.target.name] = this.state.flag_phone + "-" + e.target.value;
      this.setState({ phone: e.target.value });
    }
    if (e.target.name === "emergency_number") {
      state[e.target.name] =
        this.state.flag_emergency_number + "-" + e.target.value;
      this.setState({ phone: e.target.value });
    }
    this.setState({ UpDataDetails: state });
  };

  //For open QR code
  handleQrOpen = () => {
    this.setState({ qrOpen: true });
  };
  handleQrClose = () => {
    this.setState({ qrOpen: false });
  };

  //for open the Change profile Dialog
  handlePinOpen = () => {
    this.setState({ chngPinOpen: true, UpDataDetails1:  _.cloneDeep(this.state.UpDataDetails) });
  };
  handlePinClose = (key) => {
    this.setState({ [key]: false });
  };

  //For change the title of user
  onSelectDegree(event) {
    this.setState({ title: event });
    const state = this.state.UpDataDetails;
    state["title"] = event.label;
    this.setState({ UpDataDetails: state });
  }

  //For update the flags
  updateFlags = (e, name) => {
    const state = this.state.UpDataDetails;
    if (name === "flag_mobile") {
      state["mobile"] = e + "-" + this.state.mobile;
      this.setState({ flag_mobile: e });
    }
    if (name === "flag_fax") {
      state["fax"] = e + "-" + this.state.fax;
      this.setState({ flag_fax: e });
    }

    if (name === "flag_phone") {
      state["phone"] = e + "-" + this.state.phone;
      this.setState({ flag_phone: e });
    }
    if (name === "flag_emergency_number") {
      state["emergency_number"] = e + "-" + this.state.phone;
      this.setState({ flag_emergency_number: e });
    }
    this.setState({ UpDataDetails: state });
  };

  //For chnaging the Place of city.
  handlePlaceChanged() {
    const place = this.city.getPlace();
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
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.stateLanguageType !== this.props.stateLanguageType) {
      this.GetLanguageMetadata();
    }
  };

  //For getting the dropdowns from the database
  getMetadata() {
    this.setState({ allMetadata: this.props.metadata},
      ()=>{
          this.GetLanguageMetadata();
      })
    // axios.get(sitedata.data.path + "/UserProfile/Metadata").then((responce) => {
    //   if (responce && responce.data && responce.data.length > 0) {
    //     this.setState({ allMetadata: responce.data[0] });
    //     this.GetLanguageMetadata();
    //   }
    // });
  }

  GetLanguageMetadata = () => {
    var Allgender = GetLanguageDropdown(
      this.state.allMetadata &&
        this.state.allMetadata.gender &&
        this.state.allMetadata.gender.length > 0 &&
        this.state.allMetadata.gender,
      this.props.stateLanguageType
    );
    this.setState({
      genderdata: Allgender,
      languageData:
        this.state.allMetadata &&
        this.state.allMetadata.languages &&
        this.state.allMetadata.languages.length > 0 &&
        this.state.allMetadata.languages,
      specialityData: GetLanguageDropdown(
        SPECIALITY.speciality.english,
        this.props.stateLanguageType
      ),
      title_degreeData:
        this.state.allMetadata &&
        this.state.allMetadata.title_degreeData &&
        this.state.allMetadata.title_degreeData.length > 0 &&
        this.state.allMetadata.title_degreeData,
    });
  };

  //For change the language and the Speciality
  handleChange_multi = (event, name) => {
    const state = this.state.UpDataDetails;
    if (name == "languages") {
      this.setState({ name_multi: event });
      state["language"] =
        event && Array.prototype.map.call(event, (s) => s.value);
    }
    if (name == "speciality") {
      this.setState({ speciality_multi: event });
    }
    this.setState({ UpDataDetails: state });
  };

  //For update the state of the Profile
  handleChange1 = (e) => {
    const state = this.state.userDetails;
    state[e.target.name] = e.target.value;
    this.setState({ userDetails: state });
  };

  //Save the User profile
  saveUserData = () => {
    var UpDataDetails = this.state.UpDataDetails;
    if(this.state.UpDataDetails?.citizen_country?.value){
    if (
      this.state.insuranceDetails.insurance !== "" &&
      this.state.insuranceDetails.insurance_number !== "" &&
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
    }
    if (
      this.state.flag_emergency_number &&
      this.state.flag_emergency_number === "" &&
      this.state.flag_emergency_number === "undefined"
    ) {
      this.setState({ flag_emergency_number: "DE" });
    }
    if (
      this.state.flag_mobile &&
      this.state.flag_mobile === "" &&
      this.state.flag_mobile === "undefined"
    ) {
      this.setState({ flag_mobile: "DE" });
    }
    if (
      this.state.flag_phone &&
      this.state.flag_phone === "" &&
      this.state.flag_phone === "undefined"
    ) {
      this.setState({ flag_phone: "DE" });
    }
    if (
      this.state.flag_fax &&
      this.state.flag_fax === "" &&
      this.state.flag_fax === "undefined"
    ) {
      this.setState({ flag_fax: "DE" });
    }
    this.setState({ loaderImage: true, phonevalidate: false });
    this.setState({ regisError1: "" });
    this.setState({ regisError2: "" });
    const user_token = this.props.stateLoginValueAim.token;
    this.setState({
      insuranceDetails: {
        insurance: "",
        insurance_number: "",
        insurance_country: "",
      },
    });
    var parent_id = this.state.UpDataDetails.parent_id
      ? this.state.UpDataDetails.parent_id
      : "0";
      var tocheckWith = UpDataDetails?.citizen_country || this?.state?.flag_mobile;
   
      var getBucket =contry && contry.length > 0 && contry.filter((value, key) => value.code === tocheckWith?.value.toUpperCase());
    axios
      .put(
        sitedata.data.path + "/UserProfile/Users/update",
        {
          type: this.state.UpDataDetails.type,
          pin: this.state.UpDataDetails.pin,
          first_name: this.state.UpDataDetails.first_name,
          last_name: this.state.UpDataDetails.last_name,
          nick_name: this.state.UpDataDetails.nick_name,
          title: this.state.UpDataDetails.title,
          birthday: this.state.UpDataDetails.birthday,
          language: this.state.UpDataDetails.language,
          speciality: this.state.speciality_multi,
          phone: this.state.UpDataDetails.phone,
          mobile: this.state.UpDataDetails.mobile,
          fax: this.state.UpDataDetails.fax,
          website: this.state.UpDataDetails.website,
          email: this.state.UpDataDetails.email,
          password: this.state.UpDataDetails.password,
          sex: this.state.UpDataDetails.sex,
          street: this.state.UpDataDetails.street,
          city: this.state.city,
          area: this.state.area,
          address: this.state.UpDataDetails.address,
          emergency_contact_name: this.state.UpDataDetails
            .emergency_contact_name,
          emergency_email: this.state.UpDataDetails.emergency_email,
          emergency_number: this.state.UpDataDetails.emergency_number,
          family_doc: this.state.UpDataDetails.family_doc,
          insurance: datas,
          is2fa: this.state.UpDataDetails.is2fa,
          country: this.state.UpDataDetails.country,
          citizen_country: this.state.UpDataDetails.citizen_country,
          pastal_code: this.state.UpDataDetails.pastal_code,
          bucket: getBucket[0].bucket,
          country_code:UpDataDetails?.citizen_country?.value || this?.state?.flag_mobile
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
          // axios
          //   .put(
          //     "https://api-eu.cometchat.io/v2.0/users/" +
          //       this.state.profile_id.toLowerCase(),
          //     {
          //       name:
          //         this.state.UpDataDetails.first_name +
          //         " " +
          //         this.state.UpDataDetails.last_name,
          //     },
          //     commonCometHeader()
          //   )
          //   .then((res) => {
          //     // var data = update_CometUser(this.props?.stateLoginValueAim?.user?.profile_id.toLowerCase() , res.data.data)
          //   });
        } else {
          this.setState({ loaderImage: false });
          if (responce.data.message === "Phone is not verified") {
            this.setState({ phonevalidate: true });
          }
          this.setState({ error3: true });
          setTimeout(() => {
            this.setState({ error3: false });
          }, 5000);
        }
      });
    } else {
      this.setState({error4: true});
    }
  };

  //Chnage Id Pin by here
  ChangeIDPIN = () => {
    if (
      !this.state.DuplicateAlies &&
      !this.state.toSmall &&
      !this.state.toSmall1
    ) {
      this.setState({ loaderImage: true });
      const user_token = this.props.stateLoginValueAim.token;
      axios
        .put(
          sitedata.data.path + "/UserProfile/Users/update",
          {
            pin: this.state.UpDataDetails1.pin,
            alies_id: this.state.UpDataDetails1.alies_id,
          },
          commonHeader(user_token)
        )
        .then((responce) => {
          if (responce.data.hassuccessed) {
            this.setState({ ChangedPIN: true, UpDataDetails1: {} });
            setTimeout(() => {
              this.setState({ ChangedPIN: false });
            }, 5000);
          }
          this.setState({ loaderImage: false });
          this.getUserData();
          this.handlePinClose("chngPinOpen");
        });
    }
  };

  // Check the Alies is duplicate or not
  changeAlies = (e) => {
    const state = this.state.UpDataDetails1;
    state[e.target.name] = e.target.value;
    this.setState({ UpDataDetails1: state });
    if (e.target.value.length > 5 && e.target.value !== "") {
      this.setState({ loaderImage: true, toSmall: false });
      const user_token = this.props.stateLoginValueAim.token;
      axios
        .get(
          sitedata.data.path +
            "/UserProfile/checkAlies?alies_id=" +
            e.target.value,
          commonHeader(user_token)
        )
        .then((responce) => {
          if (responce.data.hassuccessed) {
            this.setState({ DuplicateAlies: true });
          } else {
            this.setState({ DuplicateAlies: false });
          }
          this.setState({ loaderImage: false });
        });
    } else {
      this.setState({ toSmall: true });
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

  //For setting the image
  SettingImage = (find) => {
    if (find) {
      find = find.split(".com/")[1];

      axios
        .get(sitedata.data.path + "/aws/sign_s3?find=" + find)
        .then((response) => {
          if (response.data.hassuccessed) {
            this.setState({ image: response.data.data });
            setTimeout(() => {
              this.setState({ loaderImage: false });
            }, 5000);
          }
        });
    }
  };
  //For getting User Data
  getUserData() {
    this.setState({ loaderImage: true });
    let user_token = this.props.stateLoginValueAim.token;
    let user_id = this.props.stateLoginValueAim.user._id;
    axios
      .get(sitedata.data.path + "/UserProfile/Users/" + user_id, commonHeader(user_token))
      .then((response) => {
        var title = {},
          titlefromD = response.data.data.title;
        var language = [],
          languagefromD = response.data.data.language;
        if (languagefromD && languagefromD.length > 0) {
          languagefromD.map((item) => {
            language.push({ value: item, label: item.replace(/_/g, " ") });
          });
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
        if (
          response.data.data.emergency_number &&
          response.data.data.emergency_number !== ""
        ) {
          let fen = response.data.data.emergency_number.split("-");
          if (fen && fen.length > 0) {
            this.setState({ flag_emergency_number: fen[0] });
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
        this.setState({ name_multi: language, title: title });
        this.setState({
          insurancefull: this.state.UpDataDetails.insurance,
          insuranceDetails: {
            insurance: "",
            insurance_number: "",
            insurance_type: "",
          },
        });
        this.setState({ loaderImage: false });
        datas = this.state.UpDataDetails.insurance;
        var find =
          response.data && response.data.data && response.data.data.image;
          var forUpdate = {value: true, token: user_token, user: response.data.data}
          this.props.LoginReducerAim(response.data.data?.email, '', user_token, () => {}, forUpdate);
        this.SettingImage(find);
      })
      .catch((error) => {
        this.setState({ loaderImage: false });
      });
  }

  //Update the State
  updateEntryState = (e) => {
    const state = this.state.UpDataDetails;
    state[e.target.name] = e.target.value;
    this.setState({ UpDataDetails: state });
  };

  //For updating gender and country
  EntryValueName = (value, name) => {
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

  //FOR UPLOADING THE IMAGE
  saveUserData1 = () => {
    this.setState({ loaderImage: true });
    const user_token = this.props.stateLoginValueAim.token;
    axios
      .put(
        sitedata.data.path + "/UserProfile/Users/updateImage",
        {
          image: this.state.uploadedimage,
        },
        commonHeader(user_token)
      )
      .then((responce) => {
        // axios
        //   .put(
        //     "https://api-eu.cometchat.io/v2.0/users/" +
        //       this.props.stateLoginValueAim.user.profile_id.toLowerCase(),
        //     {
        //       avatar: this.state.uploadedimage,
        //     },
        //     commonCometHeader()
        //   )
        //   .then((res) => {
        //     // var data = update_CometUser(this.props?.stateLoginValueAim?.user?.profile_id.toLowerCase() , res.data.data)
        //   });
        var find1 = this.state.uploadedimage;

        this.SettingImage(find1);
      });
  };

  // Check the Alies is duplicate or not
  changePin = (e) => {
    const state = this.state.UpDataDetails1;
    state[e.target.name] = e.target.value;
    this.setState({ UpDataDetails1: state });
    if (e.target.value.length > 3 && e.target.value !== "") {
      this.setState({ toSmall1: false });
    } else {
      this.setState({ toSmall1: true });
    }
  };

  
  OnMobileCodeChange = (event) => {
    let translate = getLanguage(this.props.languageType)
    let { change_citizenship, Yes, No } = translate;
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div
              className={
               this.props.settings &&
               this.props.settings.setting &&
               this.props.settings.setting.mode === "dark"
                  ? "dark-confirm react-confirm-alert-body"
                  : "react-confirm-alert-body"
              }
            >
              <h1>{change_citizenship}</h1>
              <div className="react-confirm-alert-button-group">
                <button
                  onClick={() => {
                    var state = this.state.UpDataDetails;
                    var data = this.state.selectCountry?.length>0 && this.state.selectCountry.filter((item)=>item.value === event)
                    if(data?.length>0){
                    state["citizen_country"] = data[0];
                    this.setState({UpDataDetails : state})
                    }
                    onClose();
                  }}
                >
                  {Yes}
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                >
                  {No}
                </button>
              </div>
            </div>
          );
        },
      });
}

  //For upload the Profile pic
  fileUpload = async (event, filed_name) => {
    if (event[0].type === "image/jpeg" || event[0].type === "image/png") {
      this.setState({ loaderImage: true });
      // let reader = new FileReader();
      let file = event[0];
      this.setState({
        loaderImage: true,
        imagePreviewUrl1: URL.createObjectURL(file),
      });
      // reader.onloadend = () => {
      //   this.setState({
      //     file: file,
      //     imagePreviewUrl1: reader.result,
      //   });
      // };
      // let user_token = this.props.stateLoginValueAim.token;
      // reader.readAsDataURL(file);
      let fileParts = event[0].name.split(".");
      let fileName = fileParts[0];
      let fileType = fileParts[1];
      const compressedFile = await resizeFile(file);

      var data = blobToFile(compressedFile, file.name)
      axios
        .post(sitedata.data.path + "/aws/sign_s3", {
          fileName: data.name,
          fileType: fileType,
          folders: this.props.stateLoginValueAim.user.profile_id + "/",
          bucket: this.props.stateLoginValueAim.user.bucket,
        })
        .then((response) => {
          var returnData = response.data.data.returnData;
          var signedRequest = returnData.signedRequest;
          var url = returnData.url;
          if (fileType === "pdf") {
            fileType = "application/pdf";
          }
          // Put the fileType in the headers for the upload
          var options = {
            headers: {
              "Content-Type": fileType,
            },
          };
          axios
            .put(signedRequest, data, options)
            .then((result) => {
              this.setState(
                {
                  uploadedimage:
                    response.data.data.returnData.url +
                    "&bucket=" +
                    this.props.stateLoginValueAim.user.bucket,
                  loaderImage: false,
                },
                () => {
                  this.saveUserData1();
                }
              );
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    } else {
      let translate = getLanguage(this.props.stateLanguageType);
      let { plz_upload_png_jpeg, ok } = translate;
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div
              className={
                this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                  ? "dark-confirm react-confirm-alert-body"
                  : "react-confirm-alert-body"
              }
            >
              <h1>{plz_upload_png_jpeg}</h1>
              <div className="react-confirm-alert-button-group">
                <button
                  onClick={() => {
                    onClose();
                  }}
                >
                  {ok}
                </button>
              </div>
            </div>
          );
        },
      });
    }
  };
  render() {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Citizenship,
      Chan_Prof_img,
      profile_info,
      profile,
      information,
      ID,
      pin_greater_then_4,
      pin,
      QR_code,
      done,
      Change,
      edit_id_pin,
      edit,
      and,
      is,
      changed,
      profile_id_taken,
      profile_id_greater_then_5,
      save_change,
      email,
      title,
      degree,
      first,
      last,
      name,
      dob,
      gender,
      street,
      add,
      city,
      postal_code,
      country,
      home_telephone,
      phone,
      country_code,
      Delete,
      mobile_number,
      male,
      female,
      other,
      number,
      mobile,
      Languages,
      spoken,
      insurance,
      add_more,
      company,
      of,
      info_copied,
      profile_updated,
      profile_not_updated,
      mobile_number_not_valid,
      insurance_added,
    } = translate;

    return (
      <div>
        {this.state.loaderImage && <Loader />}
        <Grid className="profileMy">
          <Grid className="profileInfo">
            {this.state.copied && (
              <div className="success_message">{info_copied}</div>
            )}
            {this.state.succUpdate && (
              <div className="success_message">{profile_updated}</div>
            )}
            {this.state.error3 && (
              <div className="err_message">{profile_not_updated}</div>
            )}
            {this.state.error4 && (
              <div className="err_message">{"Please fill the citizenship country"}</div>
            )}
            {this.state.phonevalidate && (
              <div className="err_message">{mobile_number_not_valid}</div>
            )}
            {this.state.ChangedPIN && (
              <div className="success_message">
                {profile} {ID} {and} {pin} {is} {changed}
              </div>
            )}
            <h1>
              {profile} {information}
            </h1>
            <p>{profile_info}</p>
          </Grid>
        </Grid>

        <Grid className="profileId">
          <Grid container direction="row" alignItems="center">
            <Grid item xs={12} md={8}>
              <Grid className="profileIdLft">
                <Grid container direction="row" alignItems="center" spacing={1}>
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
              <Grid 
               className={
                this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                  ? "darkTheme addSpeclContnt"
                  : "qrBoxCntnt"
              }
              // className="qrBoxCntnt darkTheme addSpeclContnt"
              >
                <Grid className="addSpeclContntIner">
                <Grid className="qrCourse ">
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
                
                </Grid>
                <Grid className="qrCourseImg">
                  <Grid>
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
                
              </Grid>
            </Modal>
            {/* End of QR Model setup */}
            <Grid item xs={12} md={4}>
              <Grid className="profileIdRght ">
                <a onClick={this.handlePinOpen}>
                  {Change} {ID} / {pin}
                </a>
              </Grid>
            </Grid>
            {/* Change ID and Pin */}
            <Modal
              open={this.state.chngPinOpen}
              onClose={() => this.handlePinClose("chngPinOpen")}
              className={
                this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                  ? "darkTheme editBoxModel"
                  : "editBoxModel"
              }
            >
              <Grid 
               className={
                this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                  ? "darkTheme addSpeclContnt"
                  : "editBoxCntnt"
              }
              // className="editBoxCntnt darkTheme addSpeclContnt"
              >
                <Grid className="editCourse">
                <Grid container direction="row" justify="center">
                    <Grid item xs={8} md={8} lg={8}>
                      <label>{edit} {ID} {and} {pin}</label>
                      <p>{edit_id_pin}</p>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                      <Grid>
                        <Grid className="entryCloseBtn">
                        <a onClick={() => this.handlePinClose("chngPinOpen")}>
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
                <Grid className="editPinform">
                  <Grid className="editField">
                    <label>
                      {profile} {ID}
                    </label>
                    <Grid>
                      <input
                        type="text"
                        name="alies_id"
                        onChange={this.changeAlies}
                        value={this.state.UpDataDetails1.alies_id}
                      />
                    </Grid>
                    {this.state.DuplicateAlies && <p>{profile_id_taken}</p>}
                    {this.state.toSmall && <p>{profile_id_greater_then_5}</p>}
                  </Grid>
                  <Grid className="editField">
                    <label>{pin}</label>
                    <Grid>
                      <input
                        type="text"
                        name="pin"
                        onChange={this.changePin}
                        value={this.state.UpDataDetails1.pin}
                      />
                    </Grid>
                    {this.state.toSmall1 && <p>{pin_greater_then_4}</p>}
                  </Grid>
                  <Grid>
                    <input
                      type="submit"
                      onClick={this.ChangeIDPIN}
                      value={save_change}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Modal>
            {/* End of Change ID and Pin */}
          </Grid>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} md={8}>
            <Grid className="profileInfo">
              <Grid className="profileInfoIner">
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={12}>
                    <label>{email}</label>
                    <Grid>
                      <input
                        name="email"
                        type="text"
                        onChange={this.updateEntryState}
                        value={this.state.UpDataDetails.email}
                        
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid className="profileInfoIner titleDegre">
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={3}>
                    <label>
                      {title} / {degree}
                    </label>
                    <Grid>
                      <Select
                        value={this.state.title}
                        onChange={(e) => this.onSelectDegree(e)}
                        options={this.state.title_degreeData}
                        placeholder="Mr."
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
                        name="first_name"
                        value={this.state.UpDataDetails.first_name}
                        onChange={this.updateEntryState}
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
                        name="last_name"
                        onChange={this.updateEntryState}
                        value={this.state.UpDataDetails.last_name}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid className="profileInfoDate">
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={4}>
                    <label>{dob}</label>
                    <Grid>
                    {/* <DatePicker
                          name="birthday"
                          value={this.state.UpDataDetails.birthday ? new Date(this.state.UpDataDetails.birthday) : new Date()}
                          onChange={this.onChange}
                      /> */}
                      <DateFormat
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
                        onClick={() => this.EntryValueName("male", "sex")}
                        className={
                          this.state.UpDataDetails.sex &&
                          this.state.UpDataDetails.sex === "male" &&
                          "SelectedGender"
                        }
                      >
                        {male}
                      </a>
                      <a
                        onClick={() => this.EntryValueName("female", "sex")}
                        className={
                          this.state.UpDataDetails.sex &&
                          this.state.UpDataDetails.sex === "female" &&
                          "SelectedGender"
                        }
                      >
                        {female}
                      </a>
                      <a
                        onClick={() => this.EntryValueName("other", "sex")}
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
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <label>
                      {street} {add}
                    </label>
                    <Grid>
                      <input
                        type="text"
                        name="address"
                        onChange={this.updateEntryState}
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
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <label>{city}</label>
                    <Grid>
                      <Autocomplete
                        value={this.state.city}
                        stateLanguageType={this.props.stateLanguageType}
                        onPlaceChanged={this.updateEntryCity.bind(this)}
                      />{" "}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <label>{postal_code}</label>
                    <Grid>
                      <input
                        type="text"
                        name="pastal_code"
                        onChange={this.updateEntryState}
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
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <label>{country}</label>
                    <Grid className="cntryDropTop">
                      <Select
                        value={this.state.UpDataDetails.country}
                        onChange={(e) => this.EntryValueName(e, "country")}
                        options={this.state.selectCountry}
                        placeholder=""
                        isSearchable={true}
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
                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={8}>
                        <label>{Citizenship} {country}</label>
                        <Grid className="cntryDropTop">
                            <Select
                                value={this.state.UpDataDetails.citizen_country || ''}
                                onChange={(e) => this.EntryValueName(e, 'citizen_country')}
                                options={this.state.selectCountry}
                                placeholder=""
                                isSearchable={true}
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
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <label>{home_telephone}</label>
                    <Grid>
                      {this.updateFLAG(this.state.UpDataDetails.phone) &&
                        this.updateFLAG(this.state.UpDataDetails.phone) !==
                          "" && (
                          <ReactFlagsSelect
                          searchable={true}
                            placeholder={country_code}
                            onSelect={(e) => {
                              this.updateFlags(e, "flag_phone");
                            }}
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
                        name="phone"
                        onChange={this.updateEntryState1}
                        value={
                          this.state.UpDataDetails.phone &&
                          this.updateMOBILE(this.state.UpDataDetails.phone)
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}></Grid>
                  <Grid className="clear"></Grid>
                </Grid>
              </Grid>

              <Grid className="profileInfoIner">
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <label>{mobile_number}</label>
                    <Grid>
                      {this.updateFLAG(this.state.UpDataDetails.mobile) &&
                        this.updateFLAG(this.state.UpDataDetails.mobile) !==
                          "" && (
                          <ReactFlagsSelect
                          searchable={true}
                            placeholder="Country Code"
                            onSelect={(e) => {
                              this.updateFlags(e, "flag_mobile");
                              this.OnMobileCodeChange(e);

                            }}
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
                       onChange={this.updateEntryState1}
                        value={
                          this.state.UpDataDetails.mobile &&
                          this.updateMOBILE(this.state.UpDataDetails.mobile)
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}></Grid>
                  <Grid className="clear"></Grid>
                </Grid>
              </Grid>

              <Grid className="profileInfoIner">
                <Grid container direction="row" alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <label>
                      {Languages} {spoken}
                    </label>
                    <Grid>
                      <Select
                        value={this.state.name_multi}
                        name="languages"
                        closeMenuOnSelect={false}
                        onChange={(e) => {
                          this.handleChange_multi(e, "languages");
                        }}
                        options={this.state.languageData}
                        placeholder=""
                        isSearchable={true}
                        className="profile-language"
                        isMulti={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={4}></Grid>
                  <Grid className="clear"></Grid>
                </Grid>
              </Grid>
              <Grid className="kycForms sprtImg">
                <Grid item xs={12} md={11}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={12} md={6}>
                    <label>{Chan_Prof_img}</label>
                      <FileUploader
                        name="uploadImage"
                        fileUpload={this.fileUpload}
                        isMulti={false}
                        comesFrom="profile"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {this.state.image && this.state.image !== "" && (
                        <img
                          className="ProfileImage"
                          onClick={() => GetUrlImage1(this.state.image)}
                          src={this.state.image}
                          alt=""
                          title=""
                        />
                      )}
                    </Grid>
                  </Grid>
                  <Grid className="clear"></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}></Grid>
          <Grid className="clear"></Grid>
        </Grid>

        <Grid className="infoSub">
          <Grid container direction="row" alignItems="center" spacing={2}>
            <Grid item xs={12} md={5}>
              <Grid className="infoSubInp">
                <input
                  type="submit"
                  onClick={this.saveUserData}
                  value={save_change}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={7}></Grid>
            <Grid className="clear"></Grid>
          </Grid>
        </Grid>
      </div>
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
  const { metadata } = state.OptionList;
  // const { Doctorsetget } = state.Doctorset;
  // const { catfil } = state.filterate;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    metadata,
    //   Doctorsetget,
    //   catfil
  };
};
export default withRouter(
  connect(mapStateToProps, { LoginReducerAim, LanguageFetchReducer, Settings, OptionList })(
    Index
  )
);
