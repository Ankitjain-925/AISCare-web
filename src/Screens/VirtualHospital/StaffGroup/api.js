import axios from "axios";
import sitedata from "sitedata";
import { commonHeader } from "component/CommonHeader/index";
import { getLanguage } from "translations/index";
import _ from 'lodash';
import { confirmAlert } from 'react-confirm-alert'; // Import
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export const onChangePage = (pageNumber, current) => {
  current.setState({
    staff_data: current.state.AllStaff.slice(
      (pageNumber - 1) * 10,
      pageNumber * 10
    ),
    currentPage: pageNumber,
  });
};

//Modal Open
export const handleOpenServ = (current) => {
  if (current.state.speciality_id && current.state.speciality_id !== 'general') {
    current.setState({ team_name: "", openServ: true, updateTrack: { speciality_id: [current.state.speciality_id] } });
  }
  else {
    current.setState({ team_name: "", openServ: true, updateTrack: {} });
  }

};

//Modal Close
export const handleCloseServ = (current) => {
  current.setState({ openServ: false, updateTrack: {}, selectSpec2: '', selectWard: '', staffslct: [], wardList: [], errorMsg: false });
};
export const updateEntryState1 = (e, current) => {
  const reqPayload = { ...current.state.reqPayload }
  const state = current.state.updateTrack;
  if (e.target.name === 'team_name') {
    current.setState({ team_name: e.target.value })
    state['team_name'] = current.state.selectSpec2?.label + '-' + current.state.selectWard?.label + '-' + e.target.value;
  }
  else {
    state[e.target.name] = e.target.value;
  }
  current.setState({ updateTrack: state });
};

// For getting the staff and implement Pagination
export const teamstaff = (current) => {
  current.setState({ loaderImage: true });
  axios
    .get(
      sitedata.data.path + "/teammember/GetTeam/" + current.props?.House?.value,
      commonHeader(current.props.stateLoginValueAim.token)
    )
    .then((response) => {
      if(response?.data?.hassuccessed){
      var totalPage = Math.ceil(response.data.data.length / 10);
      current.setState(
        {
          AllStaff: response.data.data,
          loaderImage: false,
          totalPage: totalPage,
          currentPage: 1,
        },
        () => {
          current.setState({ loaderImage: false });
          if (totalPage > 1) {
            var pages = [];
            for (var i = 1; i <= current.state.totalPage; i++) {
              pages.push(i);
            }
            current.setState({
              staff_data: current.state.AllStaff.slice(0, 10),
              pages: pages,
            });
          } else {
            current.setState({ staff_data: current.state.AllStaff });
          }
        }
      );
      }
    });
};

//For adding the New staff 
export const handleSubmit = (current) => {
  const { selectSpec2, selectWard, staffslct } = current.state;
  let translate = getLanguage(current.props.stateLanguageType);
  let { Please_select_speciality, Please_select_ward, Please_enter_team_name, Please_select_staff_name } = translate;
  var data = current.state.updateTrack;
  current.setState({ errorMsg: '' })
  data.house_id = current.props?.House?.value;
  if (!data.speciality_id || (data && data?.speciality_id && data?.speciality_id.length < 1)) {
    current.setState({ errorMsg: Please_select_speciality })
  } else if (!data.ward_id || ((data && data?.ward_id && data?.ward_id.length < 1)) || current.state.updateTrack.team_name.includes("undefined")) {
    current.setState({ errorMsg: Please_select_ward })
  }
  else if (!current.state.team_name || (current.state.team_name && current.state.team_name.length < 1)) {
    current.setState({ errorMsg: Please_enter_team_name })
  }
  else if (!data.staff || (data && data?.staff && data?.staff.length < 1)) {
    current.setState({ errorMsg: Please_select_staff_name })
  }
  else {
    var nurse1 = [];
    const state = current.state.updateTrack;
    current.state.staffslct.map((item2) => {
      nurse1.push(item2.value)
    });
    state['staff'] = nurse1;
    current.setState({ updateTrack: state });

    current.setState({ loaderImage: true });
    // console.log("111", data)
    if (data?._id) {
      axios
        .put(
          sitedata.data.path + "/teammember/UpdateTeam/" + data?.house_id + "/" + data?.staff_id, data,
          commonHeader(current.props.stateLoginValueAim.token)
        )
        .then((responce) => {
          if (responce && responce.data && responce.data.message === "Team Already Exist") {
            current.setState({ loaderImage: false, errorMsg: "Group Already Exist" });
          } else {
            teamstaff(current);
            current.setState({
              updateTrack: {},
              selectSpec2: '',
              selectWard: []
            });
            handleCloseServ(current);
          }
        })
        .catch(() => {
          current.setState({ loaderImage: false });
          handleCloseServ(current);
        })
    }
    else {
      axios
        .post(sitedata.data.path + "/teammember/AddGroup",
          data,
          commonHeader(current.props.stateLoginValueAim.token))
        .then((responce) => {
          if (responce && responce.data && responce.data.message === "Group Already Exist") {
            current.setState({ loaderImage: false, errorMsg: responce?.data?.message });
          } else {
            current.setState({ loaderImage: false });
            teamstaff(current);
            handleCloseServ(current);
          }
        })
        .catch(function (error) {
          current.setState({ loaderImage: false });
          handleCloseServ(current);
        });
    }
  }
}


//Delete the Staff
export const DeleteStaff = (data, current) => {
  let translate = getLanguage(current.props.stateLanguageType);
  let {
    deleteStaff,
    yes_deleteStaff,
    are_you_sure,
    cancel_keepStaff,
  } = translate;
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <Grid
          className={
            current.props.settings &&
              current.props.settings.setting &&
              current.props.settings.setting.mode === 'dark'
              ? 'dark-confirm deleteStep'
              : 'deleteStep'
          }
        >
          <Grid className="deleteStepLbl">
            <Grid>
              <a
                onClick={() => {
                  onClose();
                }}
              >
                <img
                  src={require('assets/images/close-search.svg')}
                  alt=""
                  title=""
                />
              </a>
            </Grid>
            <label>{deleteStaff}</label>
          </Grid>
          <Grid className="deleteStepInfo">
            <label>{are_you_sure}</label>
            <Grid>
              <label></label>
            </Grid>
            <Grid>
              <Button
                onClick={() => {
                  removestaff(data, current);
                }}
              >
                {yes_deleteStaff}
              </Button>
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                {cancel_keepStaff}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    },
  });

};

export const removestaff = (data, current) => {
  let translate = getLanguage(current.props.stateLanguageType);
  let { removeStaff, really_want_to_remove_staff, No, Yes } = translate;
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div
          className={
            current.props.settings &&
              current.props.settings.setting &&
              current.props.settings.setting.mode &&
              current.props.settings.setting.mode === 'dark'
              ? 'dark-confirm react-confirm-alert-body'
              : 'react-confirm-alert-body'
          }
        >
          <h1 class="alert-btn">{removeStaff}</h1>
          <p>{really_want_to_remove_staff}</p>
          <div className="react-confirm-alert-button-group">
            <button onClick={onClose}>{No}</button>
            <button
              onClick={() => {
                DeleteStaffOk(data, current);
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

export const DeleteStaffOk = (data, current) => {
  current.setState({ loaderImage: true });
  axios
    .delete(
      sitedata.data.path + "/teammember/DeleteTeam/" + current.props?.House?.value + "/" + data?.staff_id,
      commonHeader(current.props.stateLoginValueAim.token)
    )
    .then((responce) => {
      if (responce.data.hassuccessed) {
        teamstaff(current);
        current.setState({ loaderImage: false });
      }

    });
};


export const GetProfessionalwstaff1 = (current) => {
  current.setState({ loaderImage: true });
  axios
    .get(
      sitedata.data.path + "/hospitaladmin/GetProfessionalwstaff/" + current.props?.House?.value,
      commonHeader(current.props.stateLoginValueAim.token)
    )
    .then((responce) => {
      if (responce.data.hassuccessed && responce.data.data) {
        var newArray = responce.data?.data?.length > 0 && responce.data.data.map((item) => {
          let name = item?.first_name && item?.last_name ? item?.first_name + ' ' + item?.last_name : item?.first_name;
          return ({ label: name, value: item?.profile_id })
        })
        current.setState({ teamstaff: newArray, teamstaff1: responce.data?.data });
      }
      current.setState({ loaderImage: false });
    });
};

export const stffchange = (e, current) => {
var state = current.state.updateTrack;
  var staff = [];
  staff = e?.length > 0 && e.map((item) => {
    return item?.value;
  })
  state['staff'] = staff;
  current.setState({ staffslct: e, updateTrack: state }, () => {
    // console.log('updateTTrack', current.state.staffslct)
  });
}

// Open Edit Model
export const editStaff = (data, current) => {
  var nurse = []
  var deep = _.cloneDeep(data);
  var a = deep.team_name.split("-");
  var spe = { label: a[0], value: deep?.speciality_id, }
  var ward = { label: a[1], value: deep?.ward_id, }
  deep.staff.map((item2) => {
    nurse.push({ label: item2?.first_name + ' ' + item2?.last_name, value: item2.profile_id })
  });
  var teamname = a[2];
  current.setState({
    updateTrack: deep,
    selectSpec2: spe,
    selectWard: ward,
    team_name: teamname,
    staffslct: nurse,
    openServ: true
  });

};

