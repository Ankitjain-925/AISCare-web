import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MMHG from "Screens/Components/mmHgField/index";
import DateFormat from "Screens/Components/DateFormat/index";
import FileUploader from "Screens/Components/JournalFileUploader/index";
import ShowHide from "Screens/Components/ShowHide/index";
import SelectField from "Screens/Components/Select/index";
import TimeFormat from "Screens/Components/TimeFormat/index";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { GetShowLabel1 } from "Screens/Components/GetMetaData/index.js";
import { LanguageFetchReducer } from "Screens/actions";
import { getLanguage } from "translations/index"
import { pure } from "recompose";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateTrack: this.props.updateTrack,
      date_format: this.props.date_format,
      time_format: this.props.time_format,
      lrpUnit: this.props.lrpUnit,
      lrpEnglish: this.props.lrpEnglish,
    };
  }

  updateEntryState1 = (value, name) => {
    var state = this.state.updateTrack;
    state[name] = value;
    this.setState({ updateTrack: state });
    this.props.updateEntryState1(value, name);
  };
  componentDidMount = () => {};

  //on adding new data
  componentDidUpdate = (prevProps) => {
    if (prevProps.updateTrack !== this.props.updateTrack) {
      this.setState({ updateTrack: this.props.updateTrack });
    }
  };

  render() {
    let translate = getLanguage(this.props.stateLanguageType)
    let {
      enter_value,
      lab_parameter,
      upr_limit,
      unit,
      lwr_limit,
      save_entry,
      visible,
      pain_areas,
      Change,
      show,
      hide,
      until,
      archive,
      rr_systolic,
      attachments,
      time_measure,
      date_measure,
      visibility,
      edit,
      Delete,
      condition_pain,
      first_visit_day,
      pain_type,
      de_archive,
      view_fullscren,
      always,
      feeling,
      date,
      time,
    } = translate;

    return (
      <div>
        {!this.props.visibility && (
          <Grid className="cnfrmDiaMain">
            <Grid className="fillDia">
              <MMHG
                name="value"
                label={enter_value}
                onChange={(e) => this.props.updateEntryState(e)}
                value={this.state.updateTrack.value}
              />
            </Grid>
            <Grid className="fillDia">
              <SelectField
              isSearchable={true}
                name="unit"
                label={unit}
                option={this.state.lrpUnit}
                onChange={(e) => this.updateEntryState1(e, "unit")}
                value={this.state.updateTrack.unit}
              />
            </Grid>
            <Grid className="fillDia">
              <MMHG
                name="upper_limit"
                Unit={this.state.updateTrack.unit && this.state.updateTrack.unit.label  || ''}
                label={upr_limit}
                onChange={(e) => this.props.updateEntryState(e)}
                value={this.state.updateTrack.upper_limit}
              />
            </Grid>
            <Grid className="fillDia">
              <MMHG
                name="lower_limit"
                Unit={this.state.updateTrack.unit && this.state.updateTrack.unit.label || ''}
                label={lwr_limit}
                onChange={(e) => this.props.updateEntryState(e)}
                value={this.state.updateTrack.lower_limit}
              />
            </Grid>
            <Grid className="fillDia">
              <SelectField
              isSearchable={true}
                name="lab_parameter"
                label={lab_parameter}
                option={this.state.lrpEnglish}
                onChange={(e) => this.updateEntryState1(e, "lab_parameter")}
                value={GetShowLabel1(
                  this.props.lrpEnglish,
                  this.state.updateTrack &&
                    this.state.updateTrack.lab_parameter &&
                    this.state.updateTrack.lab_parameter.value,
                  this.props.stateLanguageType,
                  false,
                  "lpr"
                )}
              />
            </Grid>
            <Grid className="fillDia">
              <Grid className="rrSysto">
                <Grid>
                  <label>{date_measure}</label>
                </Grid>
                <DateFormat
                  name="date_measured"
                  value={
                    this.state.updateTrack.date_measured
                      ? new Date(this.state.updateTrack.date_measured)
                      : new Date()
                  }
                  date_format={this.state.date_format}
                  onChange={(e) => this.updateEntryState1(e, "date_measured")}
                />
              </Grid>
            </Grid>
            <Grid className="fillDia">
              <Grid className="rrSysto">
                <Grid>
                  <label>{time_measure}</label>
                </Grid>
                <TimeFormat
                  name="time_measured"
                  value={
                    this.state.updateTrack.time_measured
                      ? new Date(this.state.updateTrack.time_measured)
                      : new Date()
                  }
                  time_format={this.state.time_format}
                  onChange={(e) => this.updateEntryState1(e, "time_measured")}
                />
              </Grid>
            </Grid>
            <Grid className="attchForms attchImg">
              <Grid>
                <label>{attachments}</label>
              </Grid>
              <FileUploader
                cur_one={this.props.cur_one}
                attachfile={
                  this.state.updateTrack && this.state.updateTrack.attachfile
                    ? this.state.updateTrack.attachfile
                    : []
                }
                name="UploadTrackImageMulti"
                comesFrom="journal"
                isMulti={true}
                fileUpload={this.props.FileAttachMulti}
              />
            </Grid>
          </Grid>
        )}

        <Grid className="infoShwHidMain3upr">
          <ShowHide
            date_format={this.state.date_format}
            value={this.state.updateTrack}
            onChange={(data) => this.props.GetHideShow(data)}
          />
          <Grid className="infoShwSave3">
            <input
              type="submit"
              value={save_entry}
              onClick={this.props.AddTrack}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { stateLanguageType } = state.LanguageReducer;
  return {
    stateLanguageType,
  };
};
export default pure(withRouter(
  connect(mapStateToProps, { LanguageFetchReducer })(Index)
));
