import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Collapsible from "react-collapsible";
import ReactTooltip from "react-tooltip";
import Condition from "Screens/Components/Condition/index";
import FileViews from "./../FileViews/index";
import PainPoint from "Screens/Components/PointPain/index";
import PainIntensity from "Screens/Components/PainIntansity/index";
import DownloadFullTrack from "Screens/Components/DownloadFullTrack/index.js";
import { getDate, newdate, getImage } from "Screens/Components/BasicMethod/index";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { GetShowLabel1 } from "../../GetMetaData/index.js";
import { LanguageFetchReducer } from "Screens/actions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import CreatedBySec from "Screens/Components/TimelineComponent/CreatedBysec";
import { getLanguage } from "translations/index"
import { pure } from "recompose";
import { Doctorset } from "Screens/Doctor/actions";
import { LoginReducerAim } from "Screens/Login/actions";
import { houseSelect } from '../../../VirtualHospital/Institutes/selecthouseaction';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.data || {},
      date_format: this.props.date_format,
      time_foramt: this.props.time_format,
      archive: this.props.archive,
      loggedinUser: this.props.loggedinUser,
      images: this.props.images,
      gender: this.props.gender,
      TrackRecord: this.props.TrackRecord,
      onlyOverview: this.props.onlyOverview,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.data !== this.props.data ||
      prevProps.loggedinUser !== this.props.loggedinUser
    ) {
      this.setState({
        item: this.props.data,
        loggedinUser: this.props.loggedinUser,
      });
    }
    if (prevProps.images !== this.props.images) {
      this.setState({ images: this.props.images });
    }
    if (prevProps.TrackRecord !== this.props.TrackRecord) {
      this.setState({ TrackRecord: this.props.TrackRecord });
    }
    if (prevProps.onlyOverview !== this.props.onlyOverview) {
      this.setState({ onlyOverview: this.props.onlyOverview });
    }
  };



  render() {
    var item = this.state.item;
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      visible,
      show,
      hide,
      until,
      archive,
      pain_type,
      pain_quality,
      edit,
      Delete,
      always,
      Download,
      img_files,
      notes,
      details,
      Date_of_event,
      Change,
      visibility,
      de_archive,
      pain_areas,
      not_mentioned,
      condition_pain,
    } = translate;
    return (
      <Grid container direction="row" className="descpCntnt">
        <Grid item xs={12} md={1} className="descpCntntLft">
          {newdate(item.datetime_on)}
        </Grid>
        <Grid item xs={12} md={10} className="descpCntntRght">
          <Grid className="descpInerRght">
            <Grid container direction="row" className="addSpc">
              <Grid item xs={12} md={6}>
                <Grid className="conPainImg">
                  <a className="conPainNote">
                    <img
                      src={require("assets/images/condition-diagnosis-family-anamnesis-diary.svg")}
                      alt=""
                      title=""
                    />
                    <span>{condition_pain}</span>{" "}
                  </a>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid className="bp_vsblSec scndOptionIner1">
                  <a
                    onClick={() => this.props.EidtOption(item.type, item, true)}
                    className="bp_vsblEye"
                  >
                    <img
                      src={require("assets/images/eye2.png")}
                      alt=""
                      title=""
                    />{" "}
                    {item.visible === "show" ? (
                      <span>{visible}</span>
                    ) : item.visible === "hide" ? (
                      <span>{hide}</span>
                    ) : (
                      <span>{not_mentioned}</span>
                    )}{" "}
                  </a>
                  <a
                    className="vsblTime"
                    data-tip
                    data-for={item.track_id + "visibility"}
                  >
                    <img
                      src={require("assets/images/clock.svg")}
                      alt=""
                      title=""
                    />
                  </a>
                  <ReactTooltip
                    className="timeIconClas"
                    id={item.track_id + "visibility"}
                    place="top"
                    effect="solid"
                    backgroundColor="#ffffff"
                  >
                    {item.visible === "show" ? (
                      <label>
                        {show} {until}
                      </label>
                    ) : (
                      <label>
                        {hide} {until}
                      </label>
                    )}
                    {item.public === "always" ? (
                      <p> {always} </p>
                    ) : item.public ? (
                      <p>{getDate(item.public, this.state.date_format)}</p>
                    ) : (
                      <p>{not_mentioned}</p>
                    )}
                  </ReactTooltip>
                  {/* <a className="bp_vsblDots"><img src={require('assets/images/nav-more.svg')} alt="" title="" />
                                            
                                            </a> */}
                  <a className="openScndhrf1">
                    <a className="vsblDots">
                      <img
                        src={require("assets/images/nav-more.svg")}
                        alt=""
                        title=""
                      />
                    </a>
                    {!this.props.Archive ? (
                      <ul>
                        <li>
                          <a onClick={(data) => this.props.ArchiveTrack(item)}>
                            <img
                              src={require("assets/images/archive-1.svg")}
                              alt=""
                              title=""
                            />
                            {archive}
                          </a>
                        </li>
                        {this.props.comesfrom === "patient" && (
                          <li>
                            {item.created_by === this.state.loggedinUser._id &&
                              (!item.updated_by || item.updated_by === "") ? (
                              <a
                                onClick={() =>
                                  this.props.EidtOption(item.type, item)
                                }
                              >
                                <img
                                  src={require("assets/images/edit-1.svg")}
                                  alt=""
                                  title=""
                                />
                                {edit}
                              </a>
                            ) : (
                              <a
                                onClick={() =>
                                  this.props.EidtOption(item.type, item, true)
                                }
                              >
                                <img
                                  src={require("assets/images/edit.svg")}
                                  alt=""
                                  title=""
                                />
                                {Change} {visibility}
                              </a>
                            )}
                          </li>
                        )}
                        {this.props.Doctorsetget?.byhospital ? (

                          this.props.stateLoginValueAim.user.houses.map((newmember) => (

                            this.props.Doctorsetget?.byhospital == newmember.value ? (
                              newmember.roles.includes("edit_condition_pain") ? (
                                this.props.comesfrom !== "patient" && (

                                  <li>
                                    <a
                                      onClick={() =>
                                        this.props.EidtOption(item.type, item)
                                      }
                                    >
                                      <img
                                        src={require("assets/images/edit-1.svg")}
                                        alt=""
                                        title=""
                                      />
                                      {edit}
                                    </a>
                                  </li>
                                ))
                                : (
                                  " "
                                )
                            ) : (" ")
                          )))
                          :  (this.props.comesfrom == "adminstaff" ? (

                            this.props.House.roles.includes("edit_condition_pain") ? (
                              this.props.comesfrom !== "patient" && (

                                <li>
                                  <a
                                    onClick={() =>
                                      this.props.EidtOption(item.type, item)
                                    }
                                  >
                                    <img
                                      src={require("assets/images/edit-1.svg")}
                                      alt=""
                                      title=""
                                    />
                                    {edit}
                                  </a>
                                </li>
                              ))
                              : (
                                " "
                              )
                          ):(
                            this.props.comesfrom !== "patient" && (

                              <li>
                                <a
                                  onClick={() =>
                                    this.props.EidtOption(item.type, item)
                                  }
                                >
                                  <img
                                    src={require("assets/images/edit-1.svg")}
                                    alt=""
                                    title=""
                                  />
                                  {edit}
                                </a>
                              </li>
                            )
                          ))}
                        <li>
                          <a onClick={() => this.props.downloadTrack(item)}>
                            <img
                              src={require("assets/images/download.svg")}
                              alt=""
                              title=""
                            />
                            {Download}
                          </a>
                        </li>
                        <li>
                          <DownloadFullTrack
                            TrackRecord={this.state.TrackRecord}
                          />
                        </li>
                        <li>
                          <a
                            onClick={(deleteKey) =>
                              this.props.DeleteTrack(item.track_id)
                            }
                          >
                            <img
                              src={require("assets/images/cancel-request.svg")}
                              alt=""
                              title=""
                            />
                            {Delete}
                          </a>
                        </li>
                      </ul>
                    ) : (
                      <ul>
                        <li>
                          <a onClick={(data) => this.props.ArchiveTrack(item)}>
                            <img
                              src={require("assets/images/archive-1.svg")}
                              alt=""
                              title=""
                            />
                            {de_archive}
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={(deleteKey) =>
                              this.props.DeleteTrack(item.track_id)
                            }
                          >
                            <img
                              src={require("assets/images/cancel-request.svg")}
                              alt=""
                              title=""
                            />
                            {Delete}
                          </a>
                        </li>
                      </ul>
                    )}
                  </a>
                </Grid>
              </Grid>
              <Grid className="clear"></Grid>
            </Grid>

            <Grid className="conPain_num addSpc">
              <label>{item.problem && item.problem}</label>
              <p>
                {item.pain_type &&
                  GetShowLabel1(
                    this.props.paintype,
                    item.pain_type.value,
                    this.props.stateLanguageType,
                    true
                  )}
              </p>
            </Grid>

            <Collapsible
              trigger={<ExpandMoreIcon />}
              triggerWhenOpen={<ExpandLessIcon />}
              open={!this.state.onlyOverview}
            >
              {
                <Grid>
                  <Grid container direction="row" className="addSpc conPain_Cntnt">
                    <Grid item xs={12} md={5}>
                      <CreatedBySec data={item} />
                      {/* <Grid className="conPain_Img">
                  <a data-tip data-for={item.track_id + "created"}>
                    <img
                      src={getImage(item.created_by_image, this.state.images)}
                      alt=""
                      title=""
                    />
                    <span>{item.created_by_temp}</span>
                  </a>
                  <ReactTooltip
                    className="timeIconClas_crested"
                    id={item.track_id + "created"}
                    place="top"
                    effect="solid"
                    backgroundColor="#ffffff"
                  >
                    <p>{item.created_by_temp}</p>
                    <p>{item.created_by_profile}</p>
                    <p>
                      <img
                        src={getImage(item.created_by_image, this.state.images)}
                        alt=""
                        title=""
                      />
                    </p>
                  </ReactTooltip>
                </Grid> */}
                    </Grid>
                    <Grid item xs={12} md={7}>
                      {/* <Grid className="conPain_MDCImg">
                                            <a><img src={require('assets/images/hLogo.jpg')} alt="" title="" />
                                                <span>Illinois Masonic Medical Center</span>
                                            </a>
                                        </Grid> */}
                    </Grid>
                    <Grid className="clear"></Grid>
                  </Grid>

                  <Grid container direction="row" className="addSpc conPainGraph">
                    <Grid item xs={12} md={5}>
                      <Grid className="conPainLft">
                        <Grid className="conPainArea">
                          <label>{pain_areas}</label>
                        </Grid>
                        <PainPoint
                          id={item.track_id}
                          gender={this.state.gender}
                          painPoint={item.painPoint}
                          isView={true}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Grid className="conPainRght">
                        <Grid className="painIntencty">
                          <PainIntensity
                            name="pain_intensity"
                            Forview={true}
                            onChange={(e) => this.props.updateEntryState(e)}
                            value={Math.round(item.pain_intensity)}
                          />
                        </Grid>

                        <Grid className="condIntencty">
                          <Condition
                            name="feeling"
                            Forview={true}
                            onChange={(e) => this.props.updateEntryState(e)}
                            value={Math.round(item.feeling)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid className="clear"></Grid>
                  </Grid>

                  <Grid className="addSpc detailMark">
                    <Collapsible trigger={details} open="true">
                      <Grid>
                        <Grid container direction="row">
                          <Grid item xs={12} md={6} className="painTypeBy">
                            <Grid container direction="row">
                              <Grid item xs={5} md={5}>
                                <label>{pain_type}</label>
                              </Grid>
                              <Grid item xs={7} md={7}>
                                <span>
                                  {item.pain_type &&
                                    GetShowLabel1(
                                      this.props.paintype,
                                      item.pain_type.value,
                                      this.props.stateLanguageType,
                                      true
                                    )}
                                </span>
                              </Grid>
                              <Grid className="clear"></Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6} className="painTypeBy">
                            <Grid container direction="row">
                              <Grid item xs={5} md={5}>
                                <label>{pain_quality}</label>
                              </Grid>
                              <Grid item xs={7} md={7}>
                                <span>
                                  {item.pain_quality &&
                                    GetShowLabel1(
                                      this.props.painquality,
                                      item.pain_quality.value,
                                      this.props.stateLanguageType,
                                      true
                                    )}
                                </span>
                              </Grid>
                              <Grid className="clear"></Grid>
                            </Grid>
                          </Grid>
                          <Grid className="clear"></Grid>
                        </Grid>
                        <Grid container direction="row">
                          <Grid item xs={12} md={6} className="painTypeBy">
                            <Grid container direction="row">
                              <Grid item xs={5} md={5}>
                                <label>{Date_of_event}</label>
                              </Grid>
                              <Grid item xs={7} md={7}>
                                <span>
                                  {item.event_date &&
                                    getDate(item.event_date, this.state.date_format)}
                                </span>
                              </Grid>
                              <Grid className="clear"></Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6} className="painTypeBy">
                            <Grid container direction="row">
                              <Grid className="clear"></Grid>
                            </Grid>
                          </Grid>
                          <Grid className="clear"></Grid>
                        </Grid>
                      </Grid>
                    </Collapsible>
                  </Grid>
                  <Grid className="addSpc detailMark">
                    <Collapsible trigger={notes} open="true">
                      <Grid className="detailCntnt">
                        <p dangerouslySetInnerHTML={{ __html: item.remarks }} />
                      </Grid>
                    </Collapsible>
                  </Grid>
                  <Grid className="addSpc detailMark">
                    <Collapsible trigger={img_files} open="true">
                      <FileViews
                        images={this.state.images}
                        attachfile={item.attachfile}
                      />
                    </Collapsible>
                  </Grid>
                </Grid>}
            </Collapsible>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const { stateLanguageType } = state.LanguageReducer;
  const { Doctorsetget } = state.Doctorset;
  const { House } = state.houseSelect;

  const { stateLoginValueAim } =
    state.LoginReducerAim;
  return {
    stateLanguageType,
    Doctorsetget,
    stateLoginValueAim,
    House,

  };
};
export default pure(
  withRouter(connect(mapStateToProps, {
    LanguageFetchReducer,
    Doctorset,
    LoginReducerAim,
    houseSelect,


  })(Index))
);
