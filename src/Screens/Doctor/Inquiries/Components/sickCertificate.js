import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loader from "Screens/Components/Loader/index.js";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import sitedata from "sitedata";
import axios from "axios";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import { Input } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { LoginReducerAim } from "Screens/Login/actions";
import { Settings } from "Screens/Login/setting";
import { confirmAlert } from "react-confirm-alert"; // Import
import { LanguageFetchReducer } from "Screens/actions";
import { getDate, getImage } from "Screens/Components/BasicMethod/index";
import { getLanguage } from "translations/index"
import Pagination from "Screens/Components/Pagination/index";
import { commonHeader } from "component/CommonHeader/index";
import { data } from "jquery";
// import * as translationDE from '../../../translations/de_json_proofread_13072020.json';
function TabContainer(props) {
  return (
    <Typography component="div" className="tabsCntnts">
      {props.children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPrescp: false,
      openReject: false,
      specialistOption: null,
      value: 0,
      MypatientsData: [],
      sickData: {},
      inqstatus: null,
      message: "",
      saveAttach: false,
      send_to_timeline: false,
    };
  }

  componentDidMount() {
    this.getMypatientsData();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.searchValue !== this.props.searchValue) {
        if(this.props.searchValue===''){
          this.getMypatientsData();
        }
        else{
          let FilterFromSearch1 = this.state.AllPres?.length>0 && this.state.AllPres.filter((obj) => {
            return JSON.stringify(obj).toLowerCase().includes(this.props.searchValue?.toLowerCase());;
          });
          this.setState({
            MypatientsData : FilterFromSearch1
          });
        }
      }
}

  getMypatientsData() {
    this.setState({ loaderImage: true });
    let user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + "/UserProfile/GetSickCertificate/", commonHeader(user_token))
      .then((response) => {
        if (response.data.hassuccessed) {
          var images = [];
          response.data.data &&
            response.data.data.length > 0 &&
            response.data.data.map((item) => {
              var find = item && item.profile_image && item.profile_image;
              if (find) {
                var find1 = find.split(".com/")[1];
                axios
                  .get(sitedata.data.path + "/aws/sign_s3?find=" + find1)
                  .then((response2) => {
                    if (response2.data.hassuccessed) {
                      item.new_image = response2.data.data;
                      images.push({
                        image: find,
                        new_image: response2.data.data,
                      });
                      this.setState({ images: images });
                    }
                  });
              }
            });

          // this.setState({ MypatientsData: response.data.data });
          var totalPage = Math.ceil(response.data.data.length / 10);
          this.setState(
            {
              AllPres: response.data.data,
              loaderImage: false,
              totalPage: totalPage,
              currentPage: 1,
            },
            () => {
              if (totalPage > 1) {
                var pages = [];
                for (var i = 1; i <= this.state.totalPage; i++) {
                  pages.push(i);
                }
                this.setState({
                  MypatientsData: this.state.AllPres.slice(0, 10),
                  pages: pages,
                });
              } else {
                this.setState({ MypatientsData: this.state.AllPres });
              }
            }
          );
        }
        this.setState({ loaderImage: false });
      })
      .catch((error) => {
        this.setState({ loaderImage: false });
      });
  }

  updateCertificate = (status, id) => {
    // let sata = status.charAt(0).toUpperCase() + status.slice(1)
    this.setState({ inqstatus: status, selected_id: id });
    this.handleOpenReject();
  };

  getImage = (image) => {
    const myFilterData =
      this.state.images &&
      this.state.images.length > 0 &&
      this.state.images.filter((value, key) => value.image === image);
    if (myFilterData && myFilterData.length > 0) {
      return myFilterData[0].new_image;
    }
  };

  saveUserData(id, timeline, send = () => {}) {
    if (timeline) {
      this.setState({ send_to_timeline: true });
    }
    this.setState({ serverMsg: "", saveAttach: false });
    if (this.state.uploadedimage == "") {
      this.setState({ serverMsg: "please upload documents" });
    } else {
      this.setState({ loaderImage: true });
      const user_token = this.props.stateLoginValueAim.token;
      axios
        .put(
          sitedata.data.path + "/UserProfile/UpdateSickCertificate/" + id,
          {
            attachfile: this.state.uploadedimage,
          },
          commonHeader(user_token)
        )
        .then((responce) => {
          send();
          this.setState({
            serverMsg: responce.data.message
              ? responce.data.message
              : responce.data.msg,
          });
          if (responce.data.hassuccessed) this.setState({ saveAttach: true, });
          setTimeout(
            function () {
              this.setState({ saveAttach: false, serverMsg: "" });
            }.bind(this),
            3000
          );
          this.setState({ loaderImage: false });
        });
    }
  }

  UploadFile(event, patient_profile_id, bucket, id) {
    let reader = new FileReader();
    let file = event[0];
    // reader.onloadend = () => {
    //     this.setState({
    //         file: file,
    //         imagePreviewUrl: reader.result
    //     });
    // }
    if (file.name.split(".").pop() === "mp4") {
      this.setState({
        file: file,
        imagePreviewUrl: require("assets/images/videoIcon.png"),
      });
    }
    if (file.name.split(".").pop() === "pdf") {
      this.setState({
        file: file,
        imagePreviewUrl: require("assets/images/pdfimg.png"),
      });
    } else if (
      file.name.split(".").pop() === "doc" ||
      file.name.split(".").pop() === "docx" ||
      file.name.split(".").pop() === "xml" ||
      file.name.split(".").pop() === "txt"
    ) {
      this.setState({
        file: file,
        imagePreviewUrl: require("assets/images/txt1.png"),
      });
    } else if (
      file.name.split(".").pop() === "xls" ||
      file.name.split(".").pop() === "xlsx" ||
      file.name.split(".").pop() === "xml"
    ) {
      this.setState({
        file: file,
        imagePreviewUrl: require("assets/images/xls1.svg"),
      });
    } else if (file.name.split(".").pop() === "csv") {
      this.setState({
        file: file,
        imagePreviewUrl: require("assets/images/csv1.png"),
      });
    } else if (
      file.name.split(".").pop() === "dcm" ||
      file.name.split(".").pop() === "DCM" ||
      file.name.split(".").pop() === "DICOM" ||
      file.name.split(".").pop() === "dicom"
    ) {
      this.setState({
        file: file,
        imagePreviewUrl: require("assets/images/dcm1.png"),
      });
    } else {
      this.setState({ file: file, imagePreviewUrl: URL.createObjectURL(file) });
    }
    let user_token = this.props.stateLoginValueAim.token;
    reader.readAsDataURL(file);
    const data = new FormData();
    for (var i = 0; i < event.length; i++) {
      var file1 = event[i];
      let fileParts = event[i].name.split(".");
      let fileName = fileParts[0];
      let fileType = fileParts[1];

      if (
        fileType === "pdf" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "jpg" ||
        fileType === "svg"
      ) {
        this.setState({ loaderImage: true });
        axios
          .post(sitedata.data.path + "/aws/sign_s3", {
            fileName: fileName,
            fileType: fileType,
            folders: patient_profile_id + "/Trackrecord/",
            bucket: bucket,
          })
          .then((response) => {
            var Filename =
              response.data.data.returnData.url + "&bucket=" + bucket;
            this.setState({
              uploadDataFile: id,
              uploadedimage: { filename: Filename, filetype: fileType },
            });

            setTimeout(
              function () {
                this.setState({ fileupods: false });
              }.bind(this),
              3000
            );

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
              .put(signedRequest, file1, options)
              .then((result) => {
                this.setState({ success: true, loaderImage: false });
              })
              .catch((error) => {
                this.setState({ success: false, loaderImage: false });
              });
          })
          .catch((error) => {
            this.setState({ success: false, loaderImage: false });
          });
      } else {
        let translate = getLanguage(this.props.stateLanguageType)
        let { UploadMust, yes } = translate;
        this.setState({ loaderImage: false });
        confirmAlert({
          message: UploadMust,
          buttons: [
            {
              label: yes,
            },
          ],
        });
      }
    }
  }

  deleteClickPatient = (status, id) => {
    if (status === "accept" && !this.state.send_to_timeline) {
      this.saveUserData(id, false, () => {
        this.UpdatetheStatus(status, id);
      });
    } else {
      this.UpdatetheStatus(status, id);
    }
  };

  UpdatetheStatus = (status, id) => {
    let user_token = this.props.stateLoginValueAim.token;
    const { message } = this.state;
    axios
      .put(
        sitedata.data.path + "/UserProfile/GetSickCertificate/" + id,
        {
          status: status,
          doctor_name:
            this.props.myData.first_name + " " + this.props.myData.last_name,
          type: "sick_certificate",
          short_msg: message,
          send_to_timeline: true,
        },
        commonHeader(user_token))
      .then((response) => {
        this.setState({
          send_to_timeline: false,
          openPrescp: false,
          openReject: false,
        });
        this.getMypatientsData();
      })
      .catch((error) => {});
  };

  removePrsecription = (status, id) => {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      update_inquiry,
      are_u_sure_remove_inquiry,
      yes,
      no,
      remove_inquiry,
    } = translate;
    this.setState({ message: null });
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
            {status && status === "remove" ? (
              <h1>{remove_inquiry}</h1>
            ) : (
              <h1>{update_inquiry}</h1>
            )}
            <p>{are_u_sure_remove_inquiry}</p>
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>{no}</button>
              <button
                onClick={() => {
                  this.deleteClickPatient(status, id);
                  onClose();
                }}
              >
                {yes}
              </button>
            </div>
          </div>
        );
      },
    });
  };

  handleOpenPrescp = (data) => {
    let imagePreviewUrl = null;
    if (
      data.status === "accept" &&
      data.attachfile &&
      data.attachfile.length > 0
    ) {
      if (data.attachfile[0].filename) {
        var find1 = data.attachfile[0].filename.split(".com/")[1];
        axios
          .get(sitedata.data.path + "/aws/sign_s3?find=" + find1)
          .then((response2) => {
            if (response2.data.hassuccessed) {
              if (
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "mp4"
              ) {
                this.setState({
                  imagePreviewUrl: require("assets/images/videoIcon.png"),
                });
              }
              if (
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "pdf"
              ) {
                this.setState({
                  imagePreviewUrl: require("assets/images/pdfimg.png"),
                });
              } else if (
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "doc" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "docx" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "xml" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "txt"
              ) {
                this.setState({
                  imagePreviewUrl: require("assets/images/txt1.png"),
                });
              } else if (
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "xls" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "xlsx" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "xml"
              ) {
                this.setState({
                  imagePreviewUrl: require("assets/images/xls1.svg"),
                });
              } else if (
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "csv"
              ) {
                this.setState({
                  imagePreviewUrl: require("assets/images/csv1.png"),
                });
              } else if (
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "dcm" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "DCM" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "DICOM" ||
                data.attachfile[0].filename
                  .split("&bucket=")[0]
                  .split(".")
                  .pop() === "dicom"
              ) {
                this.setState({
                  imagePreviewUrl: require("assets/images/dcm1.png"),
                });
              } else {
                this.setState({ imagePreviewUrl: response2.data.data });
              }
            }
          });
      }
    } else {
      this.setState({ imagePreviewUrl: imagePreviewUrl });
    }

    this.setState({ openPrescp: true, sickData: data, saveAttach: false });
  };

  handleClosePrescp = () => {
    this.setState({
      openPrescp: false,
      imagePreviewUrl: null,
      saveAttach: false,
    });
  };

  handleOpenReject = () => {
    this.setState({ openReject: true });
  };
  handleCloseReject = () => {
    this.setState({ openReject: false });
  };

  //For chnage the page
  onChangePage = (pageNumber) => {
    this.setState({
      MypatientsData: this.state.AllPres.slice(
        (pageNumber - 1) * 10,
        pageNumber * 10
      ),
      currentPage: pageNumber,
    });
  };

  render() {
    const { inqstatus, sickData, MypatientsData, imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          style={{ borderRadius: "10%", maxWidth: 350, marginBottom: 10 }}
          src={imagePreviewUrl}
        />
      );
    }
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      previous,
      next,
      browse,
      capab_Doctors,
      Case,
      status,
      sent_on,
      Patient,
      sent,
      days,
      on,
      short_msg,
      what_ur_profession,
      prescription,
      snd_patient_timeline_email,
      reject,
      approve,
      suported_file_type_jpg_png,
      Pending,
      request,
      edit,
      Rejected,
      Answered,
      Cancelled,
      req_updated_successfully,
      sick_cert,
      my_doc,
      New,
      inquiry,
      see_details,
      or_drag_here,
      decline,
      remove,
      doc_and_statnderd_ques,
      doc_aimedis_private,
      Annotations,
      details,
      questions,
      how_u_feeling,
      is_ur_temp_high_to_38,
      which_symptoms_do_u_hav,
      show,
      since_when,
      have_u_already_been_sick,
      how_long_do_u_unable_to_work,
      it_is_known_dieseas,
      r_u_tracking_medi,
      do_u_hv_allergies,
      attached_doc,
    } = translate;

    return (
      <div>
        {this.state.successfullsent && (
          <div className="success_message">{req_updated_successfully}</div>
        )}
        <Grid className="presOpinionIner">
          {this.state.loaderImage && <Loader />}
          <Table>
            <Thead>
              <Tr>
                <Th>{Case}</Th>
                <Th>{sent_on}</Th>
                <Th>{Patient}</Th>
                <Th>{status}</Th>
              </Tr>
            </Thead>

            <Tbody>
              {MypatientsData &&
                MypatientsData.length > 0 &&
                MypatientsData.map((data, index) => (
                  <Tr>
                    <Td>
                      {data.which_symptomps
                        ? data.which_symptomps
                        : "Not mentioned"}
                    </Td>
                    <Td>
                      {data.send_on
                        ? getDate(
                            data.send_on,
                            this.props.settings.setting
                              ? this.props.settings.setting.date_format
                              : "DD/MM/YYYY"
                          )
                        : "Not mentioned"}
                    </Td>
                    <Td className="presImg">
                      <img
                        src={
                          data.patient_info && data.patient_info.profile_image
                            ? getImage(
                                data.patient_info.profile_image,
                                this.state.images
                              )
                            : require("assets/images/dr1.jpg")
                        }
                        alt=""
                        title=""
                      />
                      {data.patient_info &&
                        data.patient_info.first_name &&
                        data.patient_info.first_name}{" "}
                      {data.patient_info &&
                        data.patient_info.last_name &&
                        data.patient_info.last_name}
                    </Td>
                    {data.status === "pending" && (
                      <Td>
                        <span className="revwYelow"></span>
                        {Pending}{" "}
                      </Td>
                    )}
                    {data.status === "accept" && (
                      <Td>
                        <span className="revwGren"></span>
                        {Answered}{" "}
                      </Td>
                    )}
                    {data.status === "decline" && (
                      <Td>
                        <span className="revwRed"></span> {Rejected}
                      </Td>
                    )}
                    {data.status === "cancel" && (
                      <Td>
                        <span className="revwRed"></span> {Cancelled}
                      </Td>
                    )}
                    {data.status === "free" && (
                      <Td>
                        <span className="revwGry"></span> {sent} {request}
                      </Td>
                    )}
                    <Td className="presEditDot scndOptionIner">
                      <a className="openScndhrf">
                        <img
                          src={require("assets/images/three_dots_t.png")}
                          alt=""
                          title=""
                          className="openScnd"
                        />
                        <ul>
                          <li>
                            <a
                              onClick={() => {
                                this.handleOpenPrescp(data);
                              }}
                            >
                              <img
                                src={require("assets/images/details.svg")}
                                alt=""
                                title=""
                              />
                              {see_details}
                            </a>
                          </li>
                          {(data.status == "free" ||
                            data.status == "pending") && (
                            <li
                              onClick={() => {
                                this.handleOpenPrescp(data);
                              }}
                            >
                              <a>
                                <img
                                  src={require("assets/images/edit.svg")}
                                  alt=""
                                  title=""
                                />
                                {approve}
                              </a>
                            </li>
                          )}
                          {(data.status == "free" ||
                            data.status == "pending") && (
                            <li
                              onClick={() => {
                                this.updateCertificate("decline", data._id);
                              }}
                            >
                              <a>
                                <img
                                  src={require("assets/images/plus.png")}
                                  alt=""
                                  title=""
                                />
                                {decline}
                              </a>
                            </li>
                          )}
                          {data.status !== "remove" && (
                            <li
                              onClick={() => {
                                this.removePrsecription("remove", data._id);
                              }}
                            >
                              <a>
                                <img
                                  src={require("assets/images/cancel-request.svg")}
                                  alt=""
                                  title=""
                                />
                                {remove}
                              </a>
                            </li>
                          )}
                        </ul>
                      </a>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
          {/* Model setup */}
          <Modal
            open={this.state.openPrescp}
            onClose={this.handleClosePrescp}
            className={
              this.props.settings &&
              this.props.settings.setting &&
              this.props.settings.setting.mode &&
              this.props.settings.setting.mode === "dark"
                ? "darkTheme prespBoxModel"
                : "prespBoxModel"
            }
          >
            <Grid className="nwPresCntnt">
              <Grid className="nwPresCntntIner">
                <Grid className="nwPresCourse">
                <Grid container direction="row" justify="center">
    <Grid item xs={8} md={8} lg={8}>
    <p>
                    {show} {inquiry}
                  </p>
                  <Grid>
                    <label>{sick_cert}</label>
                  </Grid>
    </Grid>
    <Grid item xs={4} md={4} lg={4}>
        <Grid>
        <Grid className="entryCloseBtn">
            <a onClick={this.handleClosePrescp}>
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
                <Grid className="docHlthMain">
                  <Grid className="drstndrdQues">
                    <h3>{doc_and_statnderd_ques}</h3>
                    <Grid className="drsplestQues">
                      <Grid>
                        <label>{doc_aimedis_private}</label>
                      </Grid>
                      <Grid>
                        <h3>
                          {sickData &&
                            sickData.docProfile &&
                            sickData.docProfile.first_name &&
                            sickData.docProfile.first_name}{" "}
                          {sickData &&
                            sickData.docProfile &&
                            sickData.docProfile.last_name &&
                            sickData.docProfile.last_name}
                        </h3>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{how_u_feeling}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.how_are_you &&
                          sickData.how_are_you}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid className="ishelpLbl">
                      <label>{is_ur_temp_high_to_38}?</label>
                    </Grid>
                    <Grid>
                      <h3>{sickData && sickData.fever && sickData.fever}</h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{which_symptoms_do_u_hav}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.which_symptomps &&
                          sickData.which_symptomps}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{since_when}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData && sickData.since_when && sickData.since_when}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{have_u_already_been_sick}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.same_problem_before &&
                          sickData.same_problem_before}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{how_long_do_u_unable_to_work}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.time_unable_work &&
                          sickData.time_unable_work}{" "}
                        {days}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{it_is_known_dieseas}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.known_diseases &&
                          sickData.known_diseases}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{r_u_tracking_medi}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData && sickData.medication && sickData.medication}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{do_u_hv_allergies}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData && sickData.allergies && sickData.allergies}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>{what_ur_profession}?</label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.professions &&
                          sickData.professions}
                      </h3>
                    </Grid>
                  </Grid>
                  <Grid className="drsplestQues">
                    <Grid>
                      <label>
                        {Annotations} / {details} / {questions}
                      </label>
                    </Grid>
                    <Grid>
                      <h3>
                        {sickData &&
                          sickData.annotations &&
                          sickData.annotations}
                      </h3>
                    </Grid>
                  </Grid>
                  {sickData.status !== "decline" && (
                    <Grid className="scamUPForms scamUPImg">
                      <Grid>
                        <label>
                          {sickData.status !== "accept"
                            ? "Upload scanned"
                            : "Scanned"}{" "}
                          {prescription}
                        </label>
                      </Grid>
                      <label className="attached_file">
                        {attached_doc} -
                        {sickData &&
                          sickData.attachfile &&
                          sickData.attachfile.map((items) => (
                            <a>
                              {items.filename &&
                                items.filename
                                  .split("Trackrecord/")[1]
                                  .split("&bucket=")[0]}
                            </a>
                          ))}
                      </label>
                      {sickData.status !== "accept" && !$imagePreview && (
                        <Dropzone
                          onDrop={(e) =>
                            this.UploadFile(
                              e,
                              sickData.patient_profile_id,
                              sickData.patient_info.bucket,
                              sickData._id
                            )
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: "dropzone" })}>
                              <Input {...getInputProps()} />
                              <Grid className="browsInput">
                                <a>
                                  <img
                                    src={require("assets/images/upload-file.svg")}
                                    alt=""
                                    title=""
                                  />
                                </a>
                                <a>
                                  {browse}{" "}
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      this.UploadFile(
                                        e.target.files,
                                        sickData.patient_profile_id,
                                        sickData.patient_info.bucket,
                                        sickData._id
                                      )
                                    }
                                    multiple={this.props.isMulti}
                                  />
                                </a>{" "}
                                {or_drag_here}
                              </Grid>
                              <p>{suported_file_type_jpg_png}</p>
                            </div>
                          )}
                        </Dropzone>
                      )}
                      {/* {(sickData.status !== 'accept' && !$imagePreview) && <Grid className="scamUPInput">
                                                <a><img src={require('assets/images/upload-file.svg')} alt="" title="" /></a>
                                                <a>Browse <input type="file" onChange={(e) => this.UploadFile(e, sickData.patient_profile_id, sickData.patient_info.bucket, sickData._id)} /></a> {or_drag_here}
                                                                            </Grid>}
                                            {(sickData.status !== 'accept') && !$imagePreview && <p>{suported_file_type_jpg_png}</p>} */}
                      {sickData.status === "accept" && !$imagePreview && (
                        <img src={sickData.attachfile[0].filename} />
                      )}
                      <Grid>{$imagePreview}</Grid>
                      {/* {(sickData.attachfile && this.state.uploadedimage && sickData.status !== 'accept') && <Grid item xs={12} md={12}>
                                            <div onClick={() => this.saveUserData(sickData._id, true)} className="approvBtn sendtotimelinenew">{snd_patient_timeline_email}</div>
                                               
                                            </Grid>} */}
                    </Grid>
                  )}
                  {this.state.serverMsg && this.state.serverMsg !== "" && (
                    <div
                      className={
                        this.state.saveAttach
                          ? "success_message"
                          : "err_message"
                      }
                    >
                      {this.state.serverMsg}
                    </div>
                  )}
                  {sickData.status !== "accept" &&
                    sickData.status !== "decline" && (
                      <Grid container direction="row">
                        {/* {this.state.saveAttach && <div>Succesully sended to patient's Timeline and Email</div>} */}

                        <Grid item xs={6} md={6}>
                          <input
                            type="button"
                            value={approve}
                            onClick={() =>
                              this.deleteClickPatient("accept", sickData._id)
                            }
                            className="approvBtn"
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <input
                            type="button"
                            value={reject}
                            onClick={() =>
                              this.updateCertificate("decline", sickData._id)
                            }
                            className="rejectBtn"
                          />
                        </Grid>
                      </Grid>
                    )}
                </Grid>
                <Grid className="infoShwHidBrdr2"></Grid>
              </Grid>
            </Grid>
          </Modal>
          {/* End of Model setup */}
          {/* Reject Model setup */}
          <Modal
            open={this.state.openReject}
            onClose={this.handleCloseReject}
            className={
              this.props.settings &&
              this.props.settings.setting &&
              this.props.settings.setting.mode &&
              this.props.settings.setting.mode === "dark"
                ? "darkTheme"
                : ""
            }
          >
            <Grid className="rejectBoxCntnt">
              <Grid className="rejectCourse">
              <Grid container direction="row" justify="center">
    <Grid item xs={8} md={8} lg={8}>
    <p
    onClick={this.handleCloseReject}>Back</p>
                  <Grid>
                    <label>{decline} {inquiry}</label>
                  </Grid>
    </Grid>
    <Grid item xs={4} md={4} lg={4}>
        <Grid>
        <Grid className="entryCloseBtn">
            <a onClick={this.handleCloseReject}>
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
              <Grid className="shrtRejctMsg">
                <Grid>
                  <label>{short_msg}</label>
                </Grid>
                <Grid>
                  <textarea
                    onChange={(e) => this.setState({ message: e.target.value })}
                  ></textarea>
                </Grid>
                <Grid>
                  <input
                    type="button"
                    value={decline}
                    onClick={() =>
                      this.deleteClickPatient(inqstatus, this.state.selected_id)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Modal>
          {/* End of Reject Model setup */}
          <Grid className="tablePagNum">
            <Grid container direction="row">
              <Grid item xs={12} md={6}>
                <Grid className="totalOutOff">
                  <a>
                    {this.state.currentPage} of {this.state.totalPage}
                  </a>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                {this.state.totalPage > 1 && (
                  <Grid className="prevNxtpag">
                    {/* {this.state.currentPage != 1 && (
                      <a
                        className="prevpag"
                        onClick={() => {
                          this.onChangePage(this.state.currentPage - 1);
                        }}
                      >
                        {previous}
                      </a>
                    )}
                    {this.state.pages &&
                      this.state.pages.length > 0 &&
                      this.state.pages.map((item, index) => (
                        <a
                          className={
                            this.state.currentPage == item &&
                            "activePageDocutmet"
                          }
                          onClick={() => {
                            this.onChangePage(item);
                          }}
                        >
                          {item}
                        </a>
                      ))}
                    {this.state.currentPage != this.state.totalPage && (
                      <a
                        className="nxtpag"
                        onClick={() => {
                          this.onChangePage(this.state.currentPage + 1);
                        }}
                      >
                        {next}
                      </a>
                    )} */}
                    <Pagination totalPage={this.state.totalPage} currentPage={this.state.currentPage} pages={this.state.pages} onChangePage={(page)=>{this.onChangePage(page)}}/>
                  </Grid>
                )}
              </Grid>
            </Grid>
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
  // const { Doctorsetget } = state.Doctorset;
  // const { catfil } = state.filterate;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    settings,
    //   Doctorsetget,
    //   catfil
  };
};
export default withRouter(
  connect(mapStateToProps, { LoginReducerAim, LanguageFetchReducer, Settings })(
    Index
  )
);
