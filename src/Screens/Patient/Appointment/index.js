import React, { Component, Children, useState } from "react";
import Grid from "@material-ui/core/Grid";
import "react-calendar/dist/Calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "@material-ui/core/Modal";
import Select from "react-select";
import Calendar2 from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { S3Image } from "Screens/Components/GetS3Images/index";
import axios from "axios";
import { authy } from "Screens/Login/authy.js";
import Geocode from "react-geocode";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { LanguageFetchReducer } from "Screens/actions";
import TooltipTrigger from "react-popper-tooltip";
import { pure } from "recompose";
import "react-popper-tooltip/dist/styles.css";
import CalendarToolbar from "Screens/Components/CalendarToolbar/index.js";
import DatePicker from "react-date-picker";
// import { S3Image } from "Screens/Components/GetS3Images/index"
import {
  getDate,
  getImage,
  getSpec,
  timeDiffCalc
} from "Screens/Components/BasicMethod/index";
import { Redirect, Route } from "react-router-dom";
import LeftMenu from "../../Components/Menus/PatientLeftMenu/index";
import LeftMenuMobile from "Screens/Components/Menus/PatientLeftMenu/mobile";
import sitedata from "sitedata";
import Autocomplete from "./Autocomplete";
import {
  getLanguage
} from "translations/index"
import SPECIALITY from "speciality";
import { subspeciality } from "subspeciality.js";
import Loader from "Screens/Components/Loader/index";
import { GetLanguageDropdown } from "Screens/Components/GetMetaData/index.js";
// import Notification from "../../Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications";
import { commonHeader } from "component/CommonHeader/index";

const CURRENT_DATE = moment().toDate();
const localizer = momentLocalizer(moment);

const modifiers = [
  {
    name: "offset",
    enabled: true,
    options: {
      offset: [0, 4],
    },
  },
];

let MyOtherNestedComponent = () => <div>NESTED COMPONENT</div>;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myEventsList: [],
      DetialData: {},
      openDash: false,
      date: new Date(),
      openFancy: false,
      openAllowAccess: false,
      selectedOption: {},
      openAllowLoc: false,
      openApoint: false,
      openFancyVdo: false,
      searchDetails: {},
      appointmentData: {},
      successfull: false,
      UpDataDetails: [],
      video_call: true,
      office_visit: true,
      currentSelected: null,
      searchCity: null,
      pastappointment: false,
      show_id: false,
      show_type: "contact",
      cancelappoint: {},
      cancelsuccess: false,
      message: "",
      cancelNable: false,
      disablebt: false,
      errMsg: ""
    };
  }

  componentDidMount() {
    this.getEvent();
    this.patientinfo();
    this.getSpecialities();
    this.getUpcomingAppointment();
    this.getPastAppointment();
  }

  //Show event on the calendar
  getEvent = () => {
    var finaldata = [];
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    axios
      .get(sitedata.data.path + "/User/AppointmentByDate1", commonHeader(user_token))
      .then((response) => {
        if (response.data.hassuccessed) {
          let indexout = 0;
          response.data.data &&
            response.data.data.length > 0 &&
            response.data.data.map((data, index) => {
              axios
                .get(sitedata.data.path + "/User/AppointOfDate1/" + data._id, commonHeader(user_token))
                .then((response) => {
                  if (response.data.hassuccessed) {
                    response.data.data &&
                      response.data.data.length > 0 &&
                      response.data.data.map((d1, index) => {
                        if (d1.start_time) {
                          var t1 = d1.start_time.split(":");
                        }
                        if (d1.end_time) {
                          var t2 = d1.end_time.split(":");
                        }
                        let da1 = new Date(data._id);
                        let da2 = new Date(data._id);
                        if (t1 && t1.length > 0) {
                          da1.setHours(t1[0]);
                          da1.setMinutes(t1[1]);
                        } else {
                          da1.setHours("00");
                          da1.setMinutes("00");
                        }
                        if (t2 && t2.length > 0) {
                          da2.setHours(t2[0]);
                          da2.setMinutes(t2[1]);
                        } else {
                          da2.setHours("00");
                          da2.setMinutes("00");
                        }
                        this[`${indexout}_ref`] = React.createRef();
                        finaldata.push({
                          id: index,
                          title:
                            d1.docProfile.first_name +
                            " " +
                            d1.docProfile.last_name,
                          start: new Date(da1),
                          end: new Date(da2),
                          indexout: indexout,
                          fulldata: [d1],
                        });
                      });
                  }
                })
                .then(() => {
                  indexout++;
                  this.setState({ myEventsList: finaldata });
                });
            });
        }
        this.setState({ loaderImage: false });
      });
  };

  GetTime = (start_time) => {
    let da1 = new Date();
    if (start_time) {
      var t1 = start_time.split(":");
    }

    if (t1 && t1.length > 0) {
      da1.setHours(t1[0]);
      da1.setMinutes(t1[1]);
    } else {
      da1.setHours("00");
      da1.setMinutes("00");
    }
    if (
      this.props.settings &&
      this.props.settings.setting &&
      this.props.settings.setting.time_format &&
      this.props.settings.setting.time_format === "12"
    ) {
      return moment(da1).format("hh:mm a");
    } else {
      return moment(da1).format("HH:mm");
    }
  };

  getUpcomingAppointment() {
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + "/UserProfile/UpcomingAppintmentPat", commonHeader(user_token))
      .then(async (response) => {
        var upcomingData =
          response.data.data &&
          response.data.data.length > 0 &&
          response.data.data.filter(
            (data) => data.status !== "cancel" && data.status !== "remove"
          );
        this.setState({
          upcomingAppointment: upcomingData,
          loaderImage: false,
        });
      });
  }

  getPastAppointment = () => {
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + "/UserProfile/PastAppintmentPat", commonHeader(user_token))
      .then((response) => {
        this.setState({
          pastAppointment: response.data.data,
          loaderImage: false,
        });
      });
  };

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ clat: parseFloat(position.coords.latitude) });
        this.setState({ clng: parseFloat(position.coords.longitude) });
        Geocode.setApiKey("AIzaSyCNLBs_RtZoI4jdrZg_CjBp9hEM6SBIh-4");
        Geocode.enableDebug();
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            const address = response.results[0].formatted_address;
            this.setState({ MycurrentLocationName: address });
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  };

  handleOpenFancyVdo = (i, type, data, doctor) => {
    this.setState({
      doctorData: doctor,
      openFancyVdo: true,
      appointmentData: data,
      doc_select: i,
      appointType: type,
      errMsg: ""
    });
    setTimeout(() => this.onChange(new Date()), 200)
    // this.onChange()
  };
  handleCloseFancyVdo = () => {
    this.setState({
      openFancyVdo: false,
      appointDate: [],
      appointmentData: {},
      currentSelected: null,
      errMsg: ""
    });
    Object.keys(this.state.allDocData).map((index, i) => { });
  };

  //For patient Info..
  patientinfo() {
    var user_id = this.props.stateLoginValueAim.user._id;
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + "/UserProfile/Users/" + user_id, commonHeader(user_token))
      .then((response) => {
        this.setState({ personalinfo: response.data.data, loaderImage: false });
      });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.stateLanguageType !== this.props.stateLanguageType) {
      this.getSpecialities();
    }
  };

  // Get Speciality DATA
  getSpecialities() {
    this.setState({
      specialityData: GetLanguageDropdown(
        SPECIALITY.speciality.english,
        this.props.stateLanguageType
      ),
      subspecialityData: GetLanguageDropdown(
        subspeciality.english,
        this.props.stateLanguageType
      ),
    });
  }

  // findAppointment
  findAppointment = (tab, doc_select, apointType, apointDay, iA) => {
    let [start, end] = this.state.allSlotes[iA]?.slot.split("-");
    apointType = apointType.replace(/['"]+/g, "");
    this.setState({
      currentSelected: iA,
      findDoc: tab,
      selectedDoc: this.state.allDocData[doc_select],
      // mypoint: {
      //   start:
      //     this.state.allDocData[doc_select] &&
      //     this.state.allDocData[doc_select][apointType][0] &&
      //     this.state.allDocData[doc_select][apointType][0][apointDay][iA],
      //   end:
      //     this.state.allDocData[doc_select] &&
      //     this.state.allDocData[doc_select][apointType][0] &&
      //     this.state.allDocData[doc_select][apointType][0][apointDay][iA + 1],
      //   type: apointType,
      // },
      mypoint: {
        start: start,
        end: end,
        type: apointType,
      },
    });
  };

  questionDetails = (e) => {
    const state = this.state.UpDataDetails;
    state[e.target.name] = e.target.value;
    this.setState({ UpDataDetails: state });
  };

  bookAppointment = () => {
    let translate = getLanguage(this.props.stateLanguageType);
    let { please_select_slots } = translate;
    this.setState({ disablebt: true });
    var insurance_no =
      this.state.personalinfo?.insurance &&
        this.state.personalinfo?.insurance.length > 0 &&
        this.state.personalinfo?.insurance[0] &&
        this.state.personalinfo?.insurance[0].insurance_number
        ? this.state.personalinfo?.insurance[0].insurance_number
        : "";
    // this.setState({ loaderImage: true });
    const user_token = this.props.stateLoginValueAim.token;
    if (this.state.mypoint?.start && this.state.mypoint?.end) {
      axios
        .post(sitedata.data.path + "/User/appointment", {
          patient: this.props.stateLoginValueAim?.user?._id,
          doctor_id:
            this.state.selectedDoc?.data && this.state.selectedDoc?.data?._id,
          insurance:
            this.state.personalinfo &&
            this.state.personalinfo?.insurance &&
            this.state.personalinfo?.insurance?.length > 0 &&
            this.state.personalinfo?.insurance[0] &&
            this.state.personalinfo?.insurance[0]?.insurance_number &&
            this.state.personalinfo?.insurance[0]?.insurance_number,
          date: this.state.selectedDate,
          start_time: this.state.mypoint?.start,
          end_time: this.state.mypoint?.end,
          appointment_type: this.state.mypoint?.type,
          insurance_number: insurance_no,
          annotations: this.state.UpDataDetails?.annotations,
          status: "free",
          patient_info: {
            patient_id: this.props.stateLoginValueAim?.user?.profile_id,
            first_name: this.props.stateLoginValueAim?.user?.first_name,
            last_name: this.props.stateLoginValueAim?.user?.last_name,
            email: this.props.stateLoginValueAim?.user?.email,
            birthday: this.props.stateLoginValueAim?.user?.birthday,
            profile_image: this.props.stateLoginValueAim?.user?.image,
            bucket: this.props.stateLoginValueAim?.user?.bucket,
          },
          lan: this.props.stateLanguageType,
          docProfile: {
            patient_id:
              this.state.selectedDoc.data &&
              this.state.selectedDoc.data.profile_id,
            first_name:
              this.state.selectedDoc.data &&
              this.state.selectedDoc.data.first_name,
            last_name:
              this.state.selectedDoc.data &&
              this.state.selectedDoc.data.last_name,
            email:
              this.state.selectedDoc.data && this.state.selectedDoc.data.email,
            birthday:
              this.state.selectedDoc.data && this.state.selectedDoc.data.birthday,
            profile_image:
              this.state.selectedDoc.data && this.state.selectedDoc.data.image,
            speciality:
              this.state.selectedDoc.data &&
              this.state.selectedDoc.data.speciality,
            subspeciality:
              this.state.selectedDoc.data &&
              this.state.selectedDoc.data.subspeciality,
            phone:
              this.state.selectedDoc.data && this.state.selectedDoc.data.phone,
          },
        })
        .then((responce) => {
          this.setState({ loaderImage: false });
          if (responce.data.hassuccessed === true) {
            this.setState({
              disablebt: false,
              successfull: true,
              openAllowAccess: false,
              openAllowLoc: false,
              openFancyVdo: false,
              currentSelected: {},
              mypoint: {}
            });
            this.getUpcomingAppointment();
            this.getPastAppointment();
            setTimeout(
              function () {
                this.setState({ successfull: false });
              }.bind(this),
              5000
            );
          }
        });
    } else {
      this.setState({ errMsg: please_select_slots })
    }
  };

  // find appointment by location or speciality
  getlocation() {
    let radius, Latitude, longitude;
    if (this.state.searchDetails && this.state.searchDetails.radius) {
      radius = this.state.searchDetails.radius + "000";
    } else {
      radius = 20 + "000";
    }
    if (!this.state.mLatitude) {
      longitude = this.state.clng;
      Latitude = this.state.clat;
    } else if (this.state.mLatitude) {
      Latitude = this.state.mLatitude;
      longitude = this.state.mlongitude;
    } else {
    }
    // if (radius && Latitude && longitude) {
    axios
      .get(sitedata.data.path + "/UserProfile/getLocation/" + radius, {
        params: {
          speciality: this.state.searchDetails.specialty,
          longitude: longitude,
          Latitude: Latitude,
        },
      })
      .then((responce) => {
        let markerArray = [];
        let selectedListArray = [];
        let NewArray = [];

        responce.data.data &&
          responce.data.data.length > 0 &&
          responce.data.data.map((item, index) => {
            if (item.data && item.data.image) {
              var find = item.data && item.data.image && item.data.image;
              if (find) {
                find = find.split(".com/")[1];
                axios
                  .get(sitedata.data.path + "/aws/sign_s3?find=" + find)
                  .then((response) => {
                    if (response.data.hassuccessed) {
                      item.data.new_image = response.data.data;
                    }
                  });
              }
            }
            NewArray.push(item);
          });
        this.setState({ allDocData: NewArray });
        this.setState({ mapMarkers: markerArray });
        this.setState({ selectedListArray: selectedListArray });
      });
    // }
  }
  // Search by City
  showPlaceDetails = (place) => {
    place = place.geometry.location;
    this.setState({ place });
    this.setState({ mLatitude: parseFloat(place.lat()) });
    this.setState({ mlongitude: parseFloat(place.lng()) });
    Geocode.enableDebug();
    Geocode.fromLatLng(this.state.mLatitude, this.state.mlongitude).then(
      (response) => {
        const address = response.results[0].formatted_address;
        this.setState({ MycurrentLocationName: address });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  apointmentType = (event) => {
    if (event.target.name == "Video") {
      this.setState({
        video_call: this.state.video_call == true ? false : true,
      });
    } else if (event.target.name == "Office") {
      this.setState({
        office_visit: this.state.office_visit == true ? false : true,
      });
    }
  };

  openPastApointment() {
    window.scrollTo({
      top: 0,
    });
    this.setState({
      pastappointment: this.state.pastappointment ? false : true,
    });
  }

  handleOpenApoint = (apoint) => {
    this.setState({ openApoint: true, cancelappoint: apoint, });
  };

  // for cancel Appointment
  CancelAppoint = () => {
    let user_token = this.props.stateLoginValueAim.token;
    let timedifference = new Date(this.state.cancelappoint.date);
    let currentDate = new Date();
    // if (currentDate.getDate() === timedifference.getDate()) {
    if (this.state.cancelappoint.start_time) {
      timedifference = timedifference.setHours(parseInt((this.state.cancelappoint.start_time.split(":"))[0]), parseInt((this.state.cancelappoint.start_time.split(":"))[1]))
      var timedifference1 = timeDiffCalc(currentDate, new Date(timedifference))
      this.setState({ loaderImage: true });
      axios
        .post(
          sitedata.data.path +
          "/UserProfile/abletocancel/" +
          this.state.cancelappoint.doctor_id,
          {
            appointment_type: this.state.cancelappoint.appointment_type,
            timedifference: timedifference1,
          },
          commonHeader(user_token)
        )
        .then((response) => {
          if (response.data.hassuccessed) {
            this.CancelAppointsments()
          }
          else {
            this.setState({
              cancelNable: true,
              openApoint: false,
            });
            window.scroll({
              top: 0,
              behavior: "smooth",
            })
            setTimeout(() => {
              this.setState({ cancelNable: false });
            }, 5000);
          }
          this.setState({
            loaderImage: false,
          });
        })
        .catch((error) => { });
    }
    else {
      this.setState({
        cancelNable: true,
        openApoint: false,
      });
      window.scroll({
        top: 0,
        behavior: "smooth",
      })
      setTimeout(() => {
        this.setState({ cancelNable: false });
      }, 5000);
    }

    // }
    // else {
    //   this.CancelAppointsments()
    // }
  };

  CancelAppointsments = () => {
    let user_token = this.props.stateLoginValueAim.token;
    axios
      .put(
        sitedata.data.path +
        "/UserProfile/GetAppointment/" +
        this.state.cancelappoint._id,
        {
          status: "cancel",
          message: this.state.message,
        },
        commonHeader(user_token)
      )
      .then((response) => {
        this.setState({
          cancelsuccess: true,
          loaderImage: false,
          openApoint: false,
        });
        window.scroll({
          top: 0,
          behavior: "smooth",
        })
        setTimeout(() => {
          this.setState({ cancelsuccess: false });
        }, 5000);
        this.getUpcomingAppointment();
      })
      .catch((error) => { });
  }


  handleCloseApoint = () => {
    this.setState({ openApoint: false });
  };
  setRadius = (event) => {
    let searchDetails = this.state.searchDetails;
    if (event.target.name == "range") {
      searchDetails["radius"] = event.target.value;
    }
    this.setState({ searchDetails: searchDetails });
  };
  handleChangeSelect = (selectedOption) => {
    let searchDetails = this.state.searchDetails;
    searchDetails["specialty"] = selectedOption.value;
    this.setState({
      selectedOption: selectedOption,
      searchDetails: searchDetails,
    });
  };
  handleAllowLoc = () => {
    this.getlocation();
    this.setState(
      { openAllowAccess: false, openAllowLoc: true, selectedOption: {} },
      () => {
        setTimeout(() => {
          this.setState({ show_type: "contact" });
        }, 2000);
      }
    );
  };
  handleCloseAllowLoc = () => {
    this.setState({ openAllowLoc: false });
  };
  handleOpenFancy = () => {
    this.setState({ openFancy: true });
  };
  handleCloseFancy = () => {
    this.setState({ openFancy: false });
  };
  handleAllowAccess = () => {
    this.getGeoLocation();
    this.setState({ openAllowAccess: true });
  };
  handleCloseAllowAccess = () => {
    this.setState({ openAllowAccess: false });
  };
  handleOpenDash = () => {
    this.setState({ openDash: true });
  };
  handleCloseDash = () => {
    this.setState({ openDash: false });
  };
  onChange = (date) => {
    this.setState({ date: date });
    var day_num;
    var Month, date1;
    if (date !== undefined && date) {
      day_num = date.getDay();
      Month = date.getMonth() + 1;
      date1 = Month + "-" + date.getDate() + "-" + date.getFullYear();
    } else {
      date = new Date();
      day_num = date.getDay();
      Month = date.getMonth() + 1;
      date1 = Month + "-" + date.getDate() + "-" + date.getFullYear();
    }
    let days;
    switch (day_num) {
      case 1:
        days = "monday";
        break;
      case 2:
        days = "tuesday";
        break;
      case 3:
        days = "wednesday";
        break;
      case 4:
        days = "thursday";
        break;
      case 5:
        days = "friday";
        break;
      case 6:
        days = "saturday";
        break;
      case 0:
        days = "sunday";
        break;
    }
    let appointmentData = this.state.appointmentData;
    let appointDate;
    if (appointmentData) {
      Object.entries(appointmentData).map(([key, value]) => {
        if (key == days) {
          appointDate = value;
          this.setState({ appointDate: appointDate });

          let DoctorSlot = [];
          appointDate.map((item, i) => {
            if (i < appointDate?.length - 1) {
              DoctorSlot.push(appointDate[i] + "-" + appointDate[i + 1])
            }
          })

          var localDateTime = new Date(new Date().setDate(new Date(date).getDate()));
          var id = this.state.doctorData?._id;
          axios
            .post(
              sitedata.data.path + '/vchat/getSlotTime',
              {
                date: localDateTime,
                doctor_id: id
              },
              commonHeader(this.props.stateLoginValueAim?.token)
            )
            .then((responce) => {
              if (responce.data.hassuccessed) {
                let bookedSlot = [];
                responce && responce.data && responce.data.data && responce.data.data.map((item) => {
                  bookedSlot.push(item?.starttime + "-" + item?.endtime)
                })
                this.calBookedSlot(DoctorSlot, bookedSlot);
                this.setState({ loaderImage: false })
              }
              this.setState({ loaderImage: false })
            })
            .catch(function (error) {
              this.setState({ loaderImage: false })
            });
        }
      });
    }
    this.setState({ apointDay: days, selectedDate: date1 });
  };

  // Find booked slots 
  calBookedSlot = (ts, booked) => {
    var slot;
    var isBooked;
    let isAlreadyExist;
    var allSlotes = [];
    var curTime = moment().add(30, 'minutes').format("HH:mm");
    var curDate = moment();
    ts.map(item => {
      const [start, end] = item.split('-')
      if (moment(this.state.date).isSame(curDate, 'date', 'month', 'year')) {
        isAlreadyExist = !(curTime <= start) ? true : false;
      } else {
        isAlreadyExist = false;
      }
      // isAlreadyExist = !(curTime <= start)
      isBooked = !booked
        .map(item => item.split('-'))
        .every(([bookedStart, bookedEnd]) =>
          (bookedStart >= end || bookedEnd <= start)
        )
      slot = `${start}-${end}`
      if (!isBooked && !isAlreadyExist) {
        allSlotes.push({ slot: slot, isBooked: isBooked, isAlreadyExist: isAlreadyExist })
      }
    })
    this.setState({ allSlotes: allSlotes })
  }

  EventComponent = (data) => {
    return (
      <TooltipTrigger
        placement="right"
        trigger="click"
        tooltip={(datas) =>
          this.Tooltip({
            getTooltipProps: datas.getTooltipProps,
            getArrowProps: datas.getArrowProps,
            tooltipRef: datas.tooltipRef,
            arrowRef: datas.arrowRef,
            placement: datas.placement,
            event: data.event,
          })
        }
        modifiers={modifiers}
      >
        {({ getTriggerProps, triggerRef }) => (
          <span
            {...getTriggerProps({
              ref: triggerRef,
              className: "trigger",
              /* your props here */
            })}
          // onClick={() => this.CallEvents(data.event)}
          >
            <p className="calendar-cont"> {data.event.title} </p>
            <p className="calendar-date">
              {" "}
              {moment(data.event.start).format("hh:mm") +
                "-" +
                moment(data.event.end).format("hh:mm")}{" "}
            </p>
          </span>
        )}
      </TooltipTrigger>
    );
  };

  DateCellCompnent = ({ children, value }) => {
    return React.cloneElement(Children.only(children), {
      style: {
        ...children.style,
        // backgroundColor: value < CURRENT_DATE ? 'lightgreen' : 'lightblue',
      },
    });
  };

  CallEvents = (event) => {
    var user_token = this.props.stateLoginValueAim.token;
    let Month = event.start.getMonth() + 1;
    let date =
      Month + "-" + event.start.getDate() + "-" + event.start.getFullYear();
    this.setState({ loaderImage: true });
    axios
      .get(sitedata.data.path + "/User/AppointOfDate/" + date, commonHeader(user_token))
      .then((response) => {
        if (response.data.hassuccessed) {
          this.setState({ SelectDate: date, DetialData: response.data.data });
        }
        this.setState({ loaderImage: false });
      });
  };

  MyCustomHeader = ({ label }) => (
    <div>
      CUSTOM HEADER:
      <div>{label}</div>
      <MyOtherNestedComponent />
    </div>
  );

  Tooltip = ({
    getTooltipProps,
    getArrowProps,
    tooltipRef,
    arrowRef,
    placement,
    event,
  }) => {
    let translate = getLanguage(this.props.stateLanguageType);

    let {
      DetailsQuestions,
      consultancy_appintment,
      office_visit,
      vdo_call,
    } = translate;
    return (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: "tooltip-container",
        })}
      >
        <div
          {...getArrowProps({
            ref: arrowRef,
            "data-placement": placement,
            className:
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode === "dark"
                ? "darktheme tooltip-arrow "
                : "tooltip-arrow ",
          })}
        />

        {event &&
          event.fulldata.length > 0 &&
          event.fulldata.map((data, index) => (
            <Grid
              className={
                this.props.settings &&
                  this.props.settings.setting &&
                  this.props.settings.setting.mode === "dark"
                  ? "darktheme meetBoxCntnt"
                  : "meetBoxCntnt"
              }
            >
              <Grid className="meetCourse">
                <Grid className="meetCloseBtn">
                  {/* <a><img src={require('assets/images/three_dots_t.png')} alt="" title="" /></a> */}
                  {/* <a onClick={this.handleCloseMeet}><img src={require('assets/images/close-search.svg')} alt="" title="" /></a> */}
                </Grid>
                <Grid className="meetVdo">
                  <Grid className="meetVdoLft">
                    {data.appointment_type == "online_appointment" && (
                      <img
                        src={require("assets/images/video-call.svg")}
                        alt=""
                        title=""
                      />
                    )}
                    {data.appointment_type == "practice_appointment" && (
                      <img
                        src={require("assets/images/dates.png")}
                        alt=""
                        title=""
                      />
                    )}
                    {data.appointment_type == "private_appointment" && (
                      <img
                        src={require("assets/images/ShapeCopy21.svg")}
                        alt=""
                        title=""
                      />
                    )}
                    <span>
                      {data.appointment_type == "practice_appointment"
                        ? consultancy_appintment
                        : data.appointment_type == "online_appointment"
                          ? vdo_call
                          : data.custom_text ? data.custom_text : office_visit}
                    </span>
                  </Grid>
                  <Grid className="meetVdoRght">
                    <p>
                      {moment(new Date(data.date), "MM-DD-YYYY").format(
                        "D MMM"
                      )}
                      , {this.GetTime(data.start_time)}
                    </p>
                  </Grid>
                </Grid>
                <Grid className="meetDetail">
                  <h1>{event.title}</h1>
                  <span>{DetailsQuestions}</span>
                  <p>
                    {event.fulldata &&
                      event.fulldata.length > 0 &&
                      event.fulldata[0].annotations}
                  </p>
                </Grid>
              </Grid>
            </Grid>
          ))}
      </div>
    );
  };
  _getHourMinut = (time) => {
    return time.toString().split(":");
  };
  Isintime = (currentTime, b_start, b_end) => {
    if (!currentTime || !b_end || !b_start) return false;
    let b_start_time, b_end_time, current_time, smint;
    b_start_time =
      parseInt(this._getHourMinut(b_start)[0]) * 60 +
      parseInt(this._getHourMinut(b_start)[1]);
    b_end_time =
      parseInt(this._getHourMinut(b_end)[0]) * 60 +
      parseInt(this._getHourMinut(b_end)[1]);
    current_time =
      parseInt(this._getHourMinut(currentTime)[0]) * 60 +
      parseInt(this._getHourMinut(currentTime)[1]);
    smint = parseInt(this._getHourMinut(currentTime)[1]);


    if (current_time >= b_start_time && current_time < b_end_time) {
      return true;
    } else {
      return false;
    }
  };

  Availabledays = (date, days_upto) => {
    let current_date = new Date();
    let Newdate = new Date();
    if (date && days_upto) {
      current_date = new Date(current_date).setHours(0, 0, 0, 0);
      Newdate = Newdate.setDate(Newdate.getDate() + parseInt(days_upto))
      return (new Date(Date.parse(date.replace(/-/gm, '/'))) < current_date || new Date(Date.parse(date.replace(/-/gm, '/'))) >= Newdate);
    }
    else {
      return false;
    }
  }

  ExitinHoliday = (date, h_start, h_end) => {
    if (h_start && h_end && date) {
      let start_date = new Date(h_start);
      let end_date = new Date(h_end);
      start_date = start_date.setHours(0, 0, 0, 0);
      end_date = end_date.setDate(end_date.getDate() + 1);
      end_date = new Date(end_date).setHours(0, 0, 0, 0);
      return (new Date(Date.parse(date.replace(/-/gm, '/'))) >= start_date && new Date(Date.parse(date.replace(/-/gm, '/'))) < end_date);
    } else {
      return false;
    }
  };

  render() {
    const { myEventsList } = this.state;
    const {
      pastappointment,
      selectedOption,
      specialityData,
      subspecialityData,
      allDocData,
      date,
      doc_select,
      appointType,
      apointDay,
    } = this.state;
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Appointmentiscanceled,
      select_spec,
      slct_time_slot,
      holiday,
      NotAvailable,
      select_specility,
      Details,
      consultancy_appintment,
      past_apointment,
      Questions,
      cancel,
      book,
      appointment_booked,
      upcming_apointment,
      office_visit,
      cancel_apointmnt,
      hide_past_appointment,
      show_past_apointment,
      km_range,
      we_r_showing_speciality,
      plz_write_short_explnation,
      short_msg,
      appointments,
      UnableCancel,
      appointment,
      arrng_apointmnt,
      today,
      sync_ur_calander,
      speciality,
      search_within,
      Video,
      Office,
      type,
      Contact,
      Services,
      latest_info,
      see_avlbl_date,
      location_of_srvc,
      this_way_can_instntly_list_of_specility,
      find_apointment,
      consultancy_cstm_calnder,
      vdo_call,
      allow_location_access,
      profile_info,
      profile,
      information,
      ID,
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
    } = translate;
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
    var myMarker = require("assets/images/loc2.png");
    var theirMarker = require("assets/images/loc.png");
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
          {/* <Autocomplete onPlaceChanged={this.showPlaceDetails.bind(this)} /> */}
          {this.state.loaderImage && <Loader />}
          <Grid container direction="row" justify="center">
            <Grid item xs={12} md={12}>
              <Grid container direction="row">
                <LeftMenu isNotShow={true} currentPage="appointment" />
                <LeftMenuMobile isNotShow={true} currentPage="appointment" />
                {/* <Notification /> */}
                {/* Video Model */}

                <Modal
                  open={this.state.openFancyVdo}
                  onClose={this.handleCloseFancyVdo}
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode === "dark"
                      ? "darkTheme editBoxModel"
                      : "editBoxModel"
                  }
                >
                  <Grid className="slotBoxMain">
                    <Grid className="slotBoxCourse">
                      <a
                        onClick={this.handleCloseFancyVdo}
                        className="timSlotClose"
                      >
                        <img
                          src={require("assets/images/close-search.svg")}
                          alt=""
                          title=""
                        />
                      </a>
                      <Grid className="selCalenderUpr">

                        <Grid className="selCalender">
                          <Calendar2
                            onChange={(e) => this.onChange(e)}
                            value={this.state.date}
                          />
                        </Grid>
                        <Grid className="selTimeSlot">
                          <Grid>
                            <label>{slct_time_slot}</label>
                          </Grid>

                          <Grid className="selTimeAM">
                            {this.state.appointDate &&
                              this.state.appointDate.length > 0 ?
                              (
                                this.Availabledays(this.state.selectedDate, this.state.appointmentData.appointment_days)
                                  ?
                                  <Grid>
                                    <span>{NotAvailable}!</span>
                                  </Grid>

                                  : this.ExitinHoliday(this.state.selectedDate, this.state.appointmentData.holidays_start,
                                    this.state.appointmentData.holidays_end)
                                    ?
                                    <Grid>
                                      <span>{holiday}!</span>
                                    </Grid> :

                                    (this.state.allSlotes && this.state.allSlotes.map((data, iA) => {
                                      if (
                                        this.Isintime(
                                          this.state.appointDate[iA],
                                          this.state.appointmentData.breakslot_start,
                                          this.state.appointmentData.breakslot_end,
                                          this.state.appointmentData.holidays_start,
                                          this.state.appointmentData.holidays_end,
                                        )
                                      )
                                        return;

                                      return (
                                        <Grid>
                                          {this.state.appointDate[iA + 1] &&
                                            this.state.appointDate[iA + 1] !==
                                            "undefined" &&
                                            iA === 0 ? (
                                            <a
                                              className={
                                                this.state.currentSelected === 0 &&
                                                "current_selected"
                                              }
                                              onClick={() => {
                                                this.findAppointment(
                                                  "tab3",
                                                  doc_select,
                                                  appointType,
                                                  apointDay,
                                                  iA
                                                );
                                              }}
                                            >
                                              {data?.slot}
                                            </a>
                                          ) : (
                                            this.state.appointDate[iA + 1] &&
                                            this.state.appointDate[iA + 1] !==
                                            "undefined" && (
                                              <a
                                                className={
                                                  this.state.currentSelected &&
                                                    this.state.currentSelected === iA
                                                    ? "current_selected"
                                                    : ""
                                                }
                                                onClick={() => {
                                                  this.findAppointment(
                                                    "tab3",
                                                    doc_select,
                                                    appointType,
                                                    apointDay,
                                                    iA
                                                  );
                                                }}
                                              >
                                                {data?.slot}
                                              </a>
                                            )
                                          )}
                                        </Grid>
                                      );
                                    })
                                    )


                              )
                              :
                              this.state.appointDate !== undefined ? (
                                <Grid>
                                  <span>{NotAvailable}!</span>
                                </Grid>
                              ) : (
                                <Grid>
                                  <span>{NotAvailable}!</span>
                                </Grid>
                              )}
                          </Grid>
                        </Grid>
                        <Grid className="delQues">
                          <Grid>
                            <label>
                              {Details} / {Questions}
                            </label>
                          </Grid>
                          <Grid>
                            <textarea
                              name="annotations"
                              onChange={(e) => {
                                this.questionDetails(e);
                              }}
                            ></textarea>
                          </Grid>
                          <div className="err_message">{this.state.errMsg}</div>
                          <Grid className="delQuesBook">

                            <a disabled={this.state.disablebt} onClick={this.bookAppointment}>{book}</a>
                            <a
                              onClick={this.handleCloseFancyVdo}>
                              {cancel}
                            </a>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Modal>
                {/* End of Video Model */}
                {/* {cancel_apointmnt} */}
                <Modal
                  open={this.state.openApoint}
                  onClose={this.handleCloseApoint}
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode === "dark"
                      ? "darkTheme editBoxModel"
                      : "editBoxModel"
                  }>
                  <Grid className="apontBoxCntnt">
                    <Grid className="apontCourse 555">

                      <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={8}>
                          <label>{cancel_apointmnt}</label>
                          {/* <p>{plz_write_short_explnation}</p> */}
                        </Grid>
                        <Grid item xs={4} md={4} lg={4}>
                          <Grid>
                            <Grid className="entryCloseBtn">
                              <a onClick={this.handleCloseApoint}>
                                <img
                                  src={require("assets/images/close-search.svg")}
                                  alt=""
                                  title=""
                                />
                              </a>
                            </Grid>
                          </Grid>
                        </Grid>
                        <p>{plz_write_short_explnation}</p>
                      </Grid>

                      {/* <Grid className="apontCloseBtn">
                        <a onClick={this.handleCloseApoint}>
                          <img
                            src={require("assets/images/close-search.svg")}
                            alt=""
                            title=""
                          />
                        </a>
                      </Grid>
                      <Grid>
                        <label>{cancel_apointmnt}</label>
                      </Grid>
                      <p>{plz_write_short_explnation}</p> */}
                    </Grid>
                    <Grid className="apontDragCntnt">
                      <Grid>
                        <Grid>
                          <label>{short_msg}</label>
                        </Grid>
                        <Grid>
                          <textarea
                            name="message"
                            onChange={(e) => {
                              this.setState({ message: e.target.value });
                            }}
                          ></textarea>
                        </Grid>
                        <Grid>
                          <input
                            type="submit"
                            value={cancel_apointmnt}
                            onClick={this.CancelAppoint}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Modal>
                {/* End of {cancel_apointmnt} */}

                {/* Allow Location Access */}
                <Modal
                  open={this.state.openAllowLoc}
                  onClose={this.handleCloseAllowLoc}
                  className={
                    this.props.settings &&
                      this.props.settings.setting &&
                      this.props.settings.setting.mode === "dark"
                      ? "darkTheme editBoxModel"
                      : "editBoxModel"
                  }
                >
                  <div className="alowLocAces 11">
                    <div className="accessCourse">
                      <div className="handleAccessBtn">
                        <a onClick={this.handleCloseAllowLoc}>
                          <img
                            src={require("assets/images/close-search.svg")}
                            alt=""
                            title=""
                          />
                        </a>
                      </div>
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        className="srchAccessLoc"
                      >
                        <Grid item xs={12} md={3}>
                          <Grid>
                            <label>{speciality}</label>
                          </Grid>
                          <Select
                            value={selectedOption}
                            onChange={this.handleChangeSelect}
                            options={specialityData}
                            placeholder={select_specility}
                            className="sel_specialty"
                          />
                        </Grid>
                        <Grid item xs={12} md={3} className="locat_srvc">
                          <Grid>
                            <label>{location_of_srvc}</label>
                          </Grid>
                          {/* <input type="text" placeholder="Search for city" /> */}
                          <Autocomplete
                            onPlaceChanged={this.showPlaceDetails.bind(this)}
                          />
                          <img
                            src={require("assets/images/search-entries.svg")}
                            alt=""
                            title=""
                          />
                        </Grid>
                        <Grid item xs={12} md={2} className="srchKm">
                          <Grid>
                            <label>{search_within}</label>
                          </Grid>
                          <input
                            type="text"
                            name="range"
                            value={
                              this.state.searchDetails &&
                                this.state.searchDetails.radius
                                ? this.state.searchDetails.radius
                                : ""
                            }
                            onChange={this.setRadius}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} className="apointType">
                          <Grid>
                            <label>
                              {appointment} {type}
                            </label>
                          </Grid>
                          <FormControlLabel
                            control={
                              this.state.video_call ? (
                                <Checkbox
                                  checked
                                  onClick={this.apointmentType}
                                  name="Video"
                                />
                              ) : (
                                <Checkbox
                                  onClick={this.apointmentType}
                                  name="Video"
                                />
                              )
                            }
                            label={Video}
                          />
                          <FormControlLabel
                            control={
                              this.state.office_visit ? (
                                <Checkbox
                                  checked
                                  name="Office"
                                  onClick={this.apointmentType}
                                />
                              ) : (
                                <Checkbox
                                  name="Office"
                                  onClick={this.apointmentType}
                                />
                              )
                            }
                            label={Office}
                          />
                        </Grid>
                      </Grid>
                      <div className="showSpcial">
                        <p>
                          <img
                            src={require("assets/images/location.png")}
                            alt=""
                            title=""
                          />
                          {we_r_showing_speciality} “
                          {this.state.MycurrentLocationName}” in{" "}
                          {this.state.searchDetails.radius
                            ? this.state.searchDetails.radius
                            : "10"}{" "}
                          {km_range}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{ textAlign: "center" }}
                      className="arng_addEntrynw"
                    >
                      <a onClick={this.handleAllowLoc}>{find_apointment}</a>
                    </div>
                    {/* New Design */}
                    <div className="allowAvailList">
                      {allDocData &&
                        allDocData.length > 0 &&
                        allDocData.map((doc, i) => (
                          <div className="allowAvailListIner">
                            <Grid container direction="row" spacing={1}>
                              <Grid item xs={12} md={3}>
                                <Grid className="spclistDr">
                                  {doc.data.new_image ? (
                                    <img
                                      className="doctor_pic"
                                      src={doc.data.new_image}
                                      alt=""
                                      title=""
                                    />
                                  ) : (
                                    <img
                                      className="doctor_pic"
                                      src={require("assets/images/avatar.png")}
                                      alt=""
                                      title=""
                                    />
                                  )}
                                  <a>
                                    {/* <img src={doc.data.image} alt="" title="" /> */}
                                    {doc.data &&
                                      doc.data.first_name &&
                                      doc.data.first_name}{" "}
                                    {doc.data &&
                                      doc.data.last_name &&
                                      doc.data.last_name}{" "}
                                    (
                                    {doc.data &&
                                      doc.data.title &&
                                      doc.data.title}
                                    )
                                  </a>
                                </Grid>
                                <Grid className="nuroDr">
                                  <label>
                                    {doc.data &&
                                      doc.data.speciality &&
                                      doc.data.speciality.length > 0 &&
                                      getSpec(
                                        doc.data.speciality,
                                        this.props.stateLanguageType
                                      )}
                                  </label>
                                  <p>
                                    {doc.data &&
                                      doc.data.subspeciality &&
                                      doc.data.subspeciality.length > 0 &&
                                      getSpec(
                                        doc.data.subspeciality,
                                        this.props.stateLanguageType
                                      )}
                                  </p>
                                </Grid>

                                {/* <Grid className="nuroDr">
                                                                                                <label>NEUROLOGY</label>
                                                                                                <p>Neurodegerenative diseases</p>
                                                                                            </Grid> */}
                              </Grid>
                              <Grid item xs={12} md={5}>
                                <Grid className="srvcTagsCntnt">
                                  <Grid className="srvcTags">
                                    <a
                                      className={
                                        this.state.show_type === "contact" &&
                                        "currentTab"
                                      }
                                      onClick={() => {
                                        this.setState({ show_type: "contact" });
                                      }}
                                    >
                                      {Contact}
                                    </a>
                                    <a
                                      className={
                                        this.state.show_type === "service" &&
                                        "currentTab"
                                      }
                                      onClick={() => {
                                        this.setState({ show_type: "service" });
                                      }}
                                    >
                                      {Services}
                                    </a>
                                    <a
                                      className={
                                        this.state.show_type ===
                                        "information" && "currentTab"
                                      }
                                      onClick={() => {
                                        this.setState({
                                          show_type: "information",
                                        });
                                      }}
                                    >
                                      {latest_info}
                                    </a>
                                  </Grid>
                                  {this.state.show_type === "contact" && (
                                    <Grid className="srvcTagsLoc">
                                      <a>
                                        <img
                                          src={require("assets/images/location-pin.svg")}
                                          alt=""
                                          title=""
                                        />
                                        {doc.data &&
                                          doc.data.city &&
                                          doc.data.city}
                                      </a>
                                      <a>
                                        <img
                                          src={require("assets/images/phone.svg")}
                                          alt=""
                                          title=""
                                        />
                                        {doc.data &&
                                          doc.data.mobile &&
                                          doc.data.mobile}
                                      </a>
                                      <a>
                                        <img
                                          src={require("assets/images/email.svg")}
                                          alt=""
                                          title=""
                                        />
                                        {doc.data &&
                                          doc.data.email &&
                                          doc.data.email}
                                      </a>
                                      <a>
                                        <img
                                          src={require("assets/images/language.svg")}
                                          alt=""
                                          title=""
                                        />
                                        {doc.data &&
                                          doc.data.language &&
                                          doc.data.language.length > 0 &&
                                          doc.data.language.join(", ")}
                                      </a>
                                    </Grid>
                                  )}
                                  {this.state.show_type === "service" && (
                                    <Grid className="srvcTagsLoc">
                                      <a>
                                        {doc.data &&
                                          doc.data.weoffer_text &&
                                          doc.data.weoffer_text}
                                      </a>
                                    </Grid>
                                  )}
                                  {this.state.show_type === "information" && (
                                    <Grid className="srvcTagsLoc">
                                      <a>
                                        {doc.data && doc.data.latest_info && (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: doc.data.latest_info,
                                            }}
                                          />
                                        )}
                                      </a>
                                    </Grid>
                                  )}
                                </Grid>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Grid className="avlablDates">
                                  <h3>{see_avlbl_date}:</h3>
                                  <Grid>
                                    {this.state.video_call && (
                                      <a
                                        onClick={() =>
                                          this.handleOpenFancyVdo(
                                            i,
                                            "online_appointment",
                                            doc.online_appointment[0],
                                            doc.data
                                          )
                                        }
                                      >
                                        <img
                                          src={require("assets/images/video-call-copy2.svg")}
                                          alt=""
                                          title=""
                                        />
                                        {vdo_call}
                                      </a>
                                    )}
                                    {this.state.office_visit && (
                                      <a
                                        onClick={() =>
                                          this.handleOpenFancyVdo(
                                            i,
                                            "appointments",
                                            doc.appointments[0],
                                            doc.data
                                          )
                                        }
                                      >
                                        <img
                                          src={require("assets/images/ShapeCopy2.svg")}
                                          alt=""
                                          title=""
                                        />
                                        {doc.appointments &&
                                          doc.appointments.length > 0 &&
                                          doc.appointments[0].custom_text
                                          ? doc.appointments[0].custom_text
                                          : office_visit}
                                      </a>
                                    )}
                                    <a
                                      onClick={() =>
                                        this.handleOpenFancyVdo(
                                          i,
                                          "practice_days",
                                          doc.practice_days[0],
                                          doc.data
                                        )
                                      }
                                      className="addClnder"
                                    >
                                      <img
                                        src={require("assets/images/cal1.png")}
                                        alt=""
                                        title=""
                                      />
                                      {consultancy_cstm_calnder}
                                    </a>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                    </div>
                    {/* End of New Design */}
                  </div>
                </Modal>
                {/* End of Allow Location Access */}
                <Grid item xs={12} md={3}>
                  {pastappointment && pastappointment == true ? (
                    <Grid className="apointUpcom 111">
                      <h4>{past_apointment}</h4>
                      {this.state.pastAppointment &&
                        this.state.pastAppointment.length > 0 &&
                        this.state.pastAppointment.map((apoint) => (
                          <Grid className="officeVst">
                            <Grid container direction="row">
                              <Grid item md={12} lg={6} className="officeVstLft">
                                <label>
                                  {apoint.date &&
                                    getDate(
                                      apoint.date,
                                      this.props.settings &&
                                      this.props.settings.setting &&
                                      this.props.settings.setting.date_format
                                    )}
                                  , {this.GetTime(apoint.start_time)}
                                </label>
                              </Grid>
                              <Grid item md={12} lg={6} className="officeVstRght">
                                {apoint.appointment_type == "appointments" ? (
                                  <a>
                                    <img src={require("assets/images/office-visit.svg")} alt="" title="" />{" "}
                                    {apoint.custom_text ? apoint.custom_text : office_visit}{" "}
                                  </a>
                                ) : apoint.appointment_type ==
                                  "online_appointment" ? (
                                  <a>
                                    <img
                                      src={require("assets/images/video-call.svg")}
                                      alt=""
                                      title=""
                                    />{" "}
                                    {vdo_call}{" "}
                                  </a>
                                ) : (
                                  <a>
                                    <img
                                      src={require("assets/images/cal.png")}
                                      alt=""
                                      title=""
                                    />
                                    {consultancy_cstm_calnder}{" "}
                                  </a>
                                )}
                              </Grid>
                            </Grid>
                            <Grid className="showSubject">
                              <Grid container direction="row">
                                <Grid item xs={12} md={12} lg={6} className="officeVstLft nuroDr">
                                  <h3>
                                    {apoint.docProfile &&
                                      apoint.docProfile.speciality &&
                                      getSpec(
                                        apoint.docProfile.speciality,
                                        this.props.stateLanguageType
                                      )}
                                  </h3>
                                  <p>
                                    {apoint.docProfile &&
                                      apoint.docProfile.subspeciality &&
                                      getSpec(
                                        apoint.docProfile.subspeciality,
                                        this.props.stateLanguageType
                                      )}
                                  </p>
                                </Grid>
                              </Grid>
                              <Grid>
                                <a>

                                  {/* <img
                                    src={require("assets/images/dr1.jpg")}
                                    alt=""
                                    title=""
                                  /> */}
                                  <S3Image imgUrl={apoint?.docProfile?.profile_image} />
                                  {apoint.docProfile &&
                                    `${apoint.docProfile.first_name} ${apoint.docProfile.last_name}`}
                                </a>
                              </Grid>
                              {/* <Grid><a><img src={require('assets/images/office-visit.svg')} alt="" title="" />Illinois Masonic Medical Center</a></Grid> */}
                            </Grid>
                          </Grid>
                        ))}
                      <Grid className="shwAppoints">
                        <p>
                          <a onClick={this.openPastApointment.bind(this)}>
                            {hide_past_appointment}
                          </a>
                        </p>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid className="apointUpcom 222">
                      <h4>{upcming_apointment}</h4>
                      {this.state.upcomingAppointment &&
                        this.state.upcomingAppointment.length > 0 &&
                        this.state.upcomingAppointment.map((apoint) => (
                          <Grid className="officeVst">
                            <Grid container direction="row">
                              <Grid item xs={6} md={6} className="officeVstLft">
                                <label>
                                  {apoint.date &&
                                    getDate(
                                      apoint.date,
                                      this.props.settings &&
                                      this.props.settings.setting &&
                                      this.props.settings.setting.date_format
                                    )}
                                  , {this.GetTime(apoint.start_time)}
                                </label>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                md={6}
                                className="officeVstRght"
                              >
                                {apoint.appointment_type == "appointments" ? (
                                  <a>
                                    <img
                                      src={require("assets/images/office-visit.svg")}
                                      alt=""
                                      title=""
                                    />{" "}
                                    {apoint.custom_text ? apoint.custom_text : office_visit}{" "}
                                  </a>
                                ) : apoint.appointment_type ==
                                  "online_appointment" ? (
                                  <a>
                                    <img
                                      src={require("assets/images/video-call.svg")}
                                      alt=""
                                      title=""
                                    />{" "}
                                    {vdo_call}{" "}
                                  </a>
                                ) : (
                                  <a>
                                    <img
                                      src={require("assets/images/cal.png")}
                                      alt=""
                                      title=""
                                    />
                                    {consultancy_cstm_calnder}{" "}
                                  </a>
                                )}
                              </Grid>
                            </Grid>
                            <Grid className="showSubject">
                              <Grid container direction="row">
                                <Grid
                                  item
                                  xs={6}
                                  md={6}
                                  className="officeVstLft nuroDr"
                                >
                                  <h3>
                                    {apoint.docProfile &&
                                      apoint.docProfile.speciality &&
                                      getSpec(
                                        apoint.docProfile.speciality,
                                        this.props.stateLanguageType
                                      )}
                                  </h3>
                                  <p>
                                    {apoint.docProfile &&
                                      apoint.docProfile.subspeciality &&
                                      getSpec(
                                        apoint.docProfile.subspeciality,
                                        this.props.stateLanguageType
                                      )}
                                  </p>
                                </Grid>

                                <Grid
                                  item
                                  xs={6}
                                  md={6}
                                  className="officeVstRght"
                                >
                                  <a className="showDetail">
                                    {apoint.status === "free" && (
                                      <img
                                        src={require("assets/images/three_dots_t.png")}
                                        alt=""
                                        title=""
                                        className="openScnd"
                                      />
                                    )}
                                    <Grid className="cancelAppoint cancelAppointSec">
                                      <a
                                        onClick={() => {
                                          this.handleOpenApoint(apoint);
                                        }}
                                      >
                                        <img
                                          src={require("assets/images/cancelAppoint.png")}
                                          alt=""
                                          title=""
                                        />
                                        {cancel_apointmnt}
                                      </a>
                                    </Grid>
                                  </a>
                                </Grid>
                              </Grid>
                              <Grid>
                                <a>
                                  <S3Image imgUrl={apoint?.docProfile?.profile_image} />
                                  {/* <img
                                    src={apoint.docProfile.image ? apoint.docProfile.image : require("assets/images/avatar.png")}
                                    // src={require("assets/images/dr1.jpg")}
                                    alt=""
                                    title=""
                                  /> */}
                                  {apoint.docProfile &&
                                    `${apoint.docProfile.first_name} ${apoint.docProfile.last_name}`}
                                </a>
                              </Grid>
                              {/* <Grid><a><img  src={require('assets/images/office-visit.svg')} alt="" title="" />Illinois Masonic Medical Center</a></Grid> */}
                            </Grid>
                          </Grid>
                        ))}
                      <Grid className="shwAppoints">
                        <p>
                          <a onClick={this.openPastApointment.bind(this)}>
                            {show_past_apointment}
                          </a>
                        </p>
                        {/* <p><a onClick={}>{cancel_apointmnt}</a></p> */}
                      </Grid>

                      {/* {cancel_apointmnt} */}
                      {/* <Modal
                                                open={this.state.openApoint}
                                                onClose={this.handleCloseApoint}>
                                                <Grid className="apontBoxCntnt">
                                                    <Grid className="apontCourse">
                                                        <Grid className="apontCloseBtn">
                                                            <a onClick={this.handleCloseApoint}>
                                                                <img src={require('assets/images/close-search.svg')} alt="" title="" />
                                                            </a>
                                                        </Grid>
                                                        <Grid><label>{cancel_apointmnt}</label></Grid>
                                                        <p>{plz_write_short_explnation}</p>
                                                    </Grid>
                                                    <Grid className="apontDragCntnt">
                                                        <Grid>
                                                            <Grid><label>{short_msg}</label></Grid>
                                                            <Grid><textarea name="message" onChange={(e)=>{this.setState({message: e.target.value})}}></textarea></Grid>
                                                            <Grid><input type="submit" value={cancel_apointmnt} onClick={this.CancelAppoint}/></Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Modal> */}
                      {/* End of {cancel_apointmnt} */}
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid className="appointArang">
                    <Grid className="apointAdd">
                      <Grid container direction="row">
                        <Grid item xs={12} md={12}>
                          {this.state.successfull && (
                            <div className="success_message">
                              {appointment_booked}
                            </div>
                          )}
                          {this.state.cancelsuccess && (
                            <div className="success_message">
                              {Appointmentiscanceled}
                            </div>
                          )}
                          {this.state.cancelNable && (
                            <div className="err_message">
                              {UnableCancel}
                            </div>
                          )}
                          <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6}>
                              <h1>{appointments}</h1>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                              <Grid className="arng_addEntrynw">
                                {/* <a onClick={this.handleOpenFancy}>+ Arrange an appointment</a> */}
                                <a onClick={this.handleAllowAccess}>
                                  + {arrng_apointmnt}
                                </a>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* Allow Location Access */}
                    <Modal
                      open={this.state.openAllowAccess}
                      onClose={this.handleCloseAllowAccess}
                      className={
                        this.props.settings &&
                          this.props.settings.setting &&
                          this.props.settings.setting.mode === "dark"
                          ? "darkTheme editBoxModel"
                          : "editBoxModel"
                      }
                    >
                      <div className="alowLocAces 22">
                        <div className="accessCourse">
                          <div className="handleAccessBtn">
                            <a onClick={this.handleCloseAllowAccess}>
                              <img src={require("assets/images/close-search.svg")} alt="" title="" />
                            </a>
                          </div>
                          <Grid container direction="row" spacing={2} className="srchAccessLoc">
                            <Grid item xs={12} md={3}>
                              <Grid><label>{speciality}</label></Grid>
                              <Select
                                value={selectedOption}
                                onChange={this.handleChangeSelect}
                                options={specialityData}
                                placeholder={select_spec}
                                className="sel_specialty"
                              />
                            </Grid>
                            <Grid item xs={12} md={4} className="locat_srvc">
                              <Grid>
                                <label>{location_of_srvc}</label>
                              </Grid>
                              {/* <input type="text" placeholder="Search for city" onPlaceChanged={this.showPlaceDetails.bind(this)} /> */}
                              {/* <Autocomplete onPlaceChanged={this.showPlaceDetails.bind(this)} /> */}
                              <Autocomplete
                                stateLanguageType={this.props.stateLanguageType}
                                onPlaceChanged={this.showPlaceDetails.bind(
                                  this
                                )}
                              />
                              <img
                                src={require("assets/images/search-entries.svg")}
                                alt=""
                                title=""
                              />
                            </Grid>
                            <Grid item xs={12} md={2} className="srchKm">
                              <Grid>
                                <label>{search_within}</label>
                              </Grid>
                              <input
                                type="text"
                                name="range"
                                onChange={this.setRadius}
                                value={
                                  this.state.searchDetails &&
                                    this.state.searchDetails.radius
                                    ? this.state.searchDetails.radius
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={3} className="apointType">
                              <Grid>
                                <label>
                                  {appointment} {type}
                                </label>
                              </Grid>
                              <FormControlLabel
                                control={
                                  this.state.video_call ? (
                                    <Checkbox
                                      checked
                                      onClick={this.apointmentType}
                                      name="Video"
                                    />
                                  ) : (
                                    <Checkbox
                                      onClick={this.apointmentType}
                                      name="Video"
                                    />
                                  )
                                }
                                label={Video}
                              />
                              <FormControlLabel
                                control={
                                  this.state.office_visit ? (
                                    <Checkbox
                                      checked
                                      name="Office"
                                      onClick={this.apointmentType}
                                    />
                                  ) : (
                                    <Checkbox
                                      name="Office"
                                      onClick={this.apointmentType}
                                    />
                                  )
                                }
                                label={Office}
                              />
                            </Grid>
                          </Grid>
                        </div>
                        <div className="showSpcial">
                          <p>
                            <img
                              src={require("assets/images/location.png")}
                              alt=""
                              title=""
                            />
                            I am here : “{this.state.MycurrentLocationName}"
                          </p>
                        </div>
                        <div className="allowAccessList">
                          {this.state.clat || this.state.mLatitude ? (
                            <Map
                              className="MapStyle"
                              google={this.props.google}
                              center={
                                this.state.mLatitude
                                  ? {
                                    lat: this.state.mLatitude,
                                    lng: this.state.mlongitude,
                                  }
                                  : {
                                    lat: this.state.clat,
                                    lng: this.state.clng,
                                  }
                              }
                              initialCenter={{
                                lat: this.state.clat,
                                lng: this.state.clan,
                              }}
                              zoom={10}
                            >
                              <Marker
                                icon={{ url: myMarker }}
                                title={this.state.MycurrentLocationName}
                                name={this.state.MycurrentLocationName}
                                position={
                                  this.state.mLatitude
                                    ? {
                                      lat: this.state.mLatitude,
                                      lng: this.state.mlongitude,
                                    }
                                    : {
                                      lat: this.state.clat,
                                      lng: this.state.clng,
                                    }
                                }
                              />
                            </Map>
                          ) : (
                            <div>
                              <div>
                                <a>
                                  <img
                                    src={require("assets/images/location.png")}
                                    alt=""
                                    title=""
                                  />
                                </a>
                              </div>
                              <h1>{allow_location_access}</h1>
                              <p>{this_way_can_instntly_list_of_specility}</p>
                            </div>
                          )}
                          {/* <div><a><img src={require('assets/images/location.png')} alt="" title="" /></a></div>
                                                          <h1>{allow_location_access}</h1>
                                                          <p>{this_way_can_instntly_list_of_specility}</p> */}
                        </div>
                        <div
                          style={{ textAlign: "center" }}
                          className="arng_addEntrynw">
                          <a onClick={this.handleAllowLoc}>{find_apointment}</a>
                        </div>
                      </div>
                    </Modal>
                    {/* End of Allow Location Access */}
                    <Grid className="getCalapoint">
                      <Grid className="getCalBnr">
                        {this.state.myEventsList &&
                          this.state.myEventsList.length > 0 && (
                            <Calendar localizer={localizer} events={myEventsList}
                              startAccessor="start" endAccessor="end"
                              popup popupOffset={{ x: 30, y: 20 }}
                              style={{ minHeight: 900 }} step={60}
                              messages={{
                                showMore: (total) => (
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onMouseOver={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                  >
                                    {`+${total} more`}
                                  </div>
                                ),
                              }}
                              components={{
                                month: { event: this.EventComponent },
                                dateCellWrapper: this.DateCellCompnent,
                                toolbar: CalendarToolbar,
                              }}
                            />
                          )}

                        {/* <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
                                Popper element
                                <div ref={setArrowElement} style={styles.arrow} />
                            </div> */}
                        {/* <img src={require('assets/images/uidoc.jpg')} alt="" title="" /> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
      </Grid >
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
  // const {Doctorsetget} = state.Doctorset;
  // const {catfil} = state.filterate;
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
export default pure(withRouter(
  connect(mapStateToProps, {
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    authy,
  })(
    GoogleApiWrapper({
      apiKey: "AIzaSyCNLBs_RtZoI4jdrZg_CjBp9hEM6SBIh-4",
    })(Index)
  )
));