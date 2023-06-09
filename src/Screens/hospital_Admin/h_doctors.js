import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LoginReducerAim } from 'Screens/Login/actions';
import { Settings } from 'Screens/Login/setting';
import InfoIcon from '@material-ui/icons/Info';
import axios from 'axios';
import { LanguageFetchReducer } from 'Screens/actions';
import { OptionList } from 'Screens/Login/metadataaction';
import sitedata from 'sitedata';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Loader from 'Screens/Components/Loader/index';
import {
  getImage,
  blockClick,
  allusers,
} from 'Screens/Components/BasicMethod/index';
import { getLanguage } from './translations/index';
import H_LeftMenu from 'Screens/Components/Menus/H_leftMenu/index';
import H_LeftMenuMobile from 'Screens/Components/Menus/H_leftMenu/mobile';
import { SearchUser } from 'Screens/Components/Search';
import CreateAdminUser from 'Screens/Components/CreateHospitalUser/index';
import ViewDetail from 'Screens/Components/ViewInformation/index';
import './style.css';
import { S3Image } from 'Screens/Components/GetS3Images/index';
import {
  commonHeader,
  commonCometDelHeader,
} from 'component/CommonHeader/index';
import Pagination from 'Screens/Components/Pagination/index';
import SelectField from 'Screens/Components/Select/index';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import AssignedHouse from 'Screens/Components/VirtualHospitalComponents/AssignedHouse/index';
// import io from 'socket.io-client';
// import { GetSocketUrl } from 'Screens/Components/BasicMethod/index';
// const SOCKET_URL = GetSocketUrl();
import {SocketIo, clearScoket} from "socket";

const specialistOptions = [
  { value: 'Specialist1', label: 'Specialist1' },
  { value: 'Specialist2', label: 'Specialist2' },
];
// var socket;
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: [],
      currentPage: 1,
      totalPage: 1,
      AllPres: [],
      pages: [1],
      images: [],
      addInqry: false,
      showInquiry: false,
      AddPrescription: {},
      successfullsent: false,
      addCreate: false,
      current_user: {},
      Housesoptions: [],
      currentHouses: [],
      openHouse: false,
      house: {},
      openDetial: false,
      MypatientsData: [],
      UpDataDetails: {},
      deleteHouses: {},
      type: 'doctor',
      checkboxdata:"",
      selectRole: false
    };
    // new Timer(this.logOutClick.bind(this))
    this.search_user = this.search_user.bind(this);
    // socket = io(SOCKET_URL);
  }

  getallGroups = () => {
    var institute_id =
      this.props.stateLoginValueAim?.user?.institute_id?.length > 0
        ? this.props.stateLoginValueAim?.user?.institute_id[0]
        : '';
    this.setState({ loaderImage: true });
    axios
      .get(
        sitedata.data.path + `/hospitaladmin/institute/${institute_id}`,
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((responce) => {
        if (responce.data.hassuccessed && responce.data.data) {
          var Housesoptions = [];
          if (
            responce.data?.data?.institute_groups &&
            responce.data?.data?.institute_groups.length > 0
          ) {
            responce.data.data.institute_groups.map((data) => {
              data?.houses &&
                data.houses.length > 0 &&
                data.houses.map((item) => {
                  Housesoptions.push({
                    group_name: data.group_name,
                    label: item.house_name,
                    value: item.house_id,
                  });
                  this.setState({ Housesoptions: Housesoptions });
                  this.setState({checkboxdata:this.props.metadata.authority?.doctor_roles})
                });
            });
          }
        }
        this.setState({ loaderImage: false });
      });
  };

  componentDidMount = () => {
    // socket.on('connection', () => {
    //   console.log('124');
    // });

    this.getAllkyc();
    this.getDoctors();
    this.getallGroups();
  };

  handleOpenCreate = () => {
    this.setState({ addCreate: true });
  };
  handleCloseCreate = () => {
    this.getDoctors();
    this.setState({ addCreate: false });
  };

  search_user = (event) => {
    if (event.target.value == '') {
      this.setState({ MypatientsData: this.state.forSearch });
      this.onChangePage(1);
    } else {
      let serach_value = SearchUser(event.target.value, this.state.forSearch);
      this.setState({ MypatientsData: serach_value });
    }
  };

  openDetail = (patient) => {
    this.setState({ openDetial: true, current_user: patient });
  };
  CloseDetail = () => {
    this.setState({ openDetial: false });
  };

  getAllkyc() {
    var user_token = this.props.stateLoginValueAim.token;
    axios
      .get(sitedata.data.path + '/User/getAllKyc', commonHeader(user_token))
      .then((response) => {
        this.setState({ getAllkyc: response.data.data });
      })
      .catch((error) => {});
  }

  getDoctors = (currentID) => {
    let { currentPage, type } = this.state;
    var user_token = this.props.stateLoginValueAim.token;
    this.setState({ loaderImage: true });
    let res = allusers(
      currentPage,
      user_token,
      type,
      this.props.stateLoginValueAim.user.institute_id
    );
    res.then((res) => {
      var images = [];
      const AllPatient = res.data && res.data.data && res.data.data;
      var socket = SocketIo();
      socket.on('data_shown', (data) => {
        // console.log('data', data);
        var elementPos =
          AllPatient?.length > 0 &&
          AllPatient.map(function (x) {
            return x._id;
          }).indexOf(data?.data?.data?._id);
        if (elementPos > -1) {
          AllPatient[elementPos] = data?.data?.data;
          this.setState({ MypatientsData: AllPatient });
        }
      });
      this.setState({ AllPatient: AllPatient, forSearch: AllPatient });
      AllPatient &&
        AllPatient.length > 0 &&
        AllPatient.map((item) => {
          var find = item && item.image && item.image;
          if (find) {
            var find1 = find.split('.com/')[1];
            axios
              .get(sitedata.data.path + '/aws/sign_s3?find=' + find1)
              .then((response2) => {
                if (response2.data.hassuccessed) {
                  item.new_image = response2.data.data;
                  images.push({ image: find, new_image: response2.data.data });
                  this.setState({ images: images });
                }
              });
          }
          if (currentID) {
            var current_user =
              AllPatient?.length > 0 &&
              AllPatient.filter((item) => item._id === currentID);
            this.setState({ current_user: current_user?.[0] });
          }
          this.setState({
            loaderImage: false,
            totalPage: Math.ceil(res.data.Total_count / 20),
            MypatientsData: this.state.AllPatient,
            TotalCount: res.data.Total_count,
          });
        });
    });
  };

  submitDelete = (deletekey, profile_id, bucket) => {
    let translate = getLanguage(this.props.stateLanguageType);
    let { DeleteUser, Yes, No, click_on_YES_user, are_you_sure } = translate;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Grid
            className={
              this.props.settings &&
              this.props.settings.setting &&
              this.props.settings.setting.mode === 'dark'
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
              <label>{DeleteUser}</label>
            </Grid>
            <Grid className="deleteStepInfo">
              <p>{click_on_YES_user}</p>
              <Grid>
                <label>{are_you_sure}</label>
              </Grid>
              <Grid>
                <Button
                  onClick={() => {
                    this.deleteClick(deletekey, profile_id, bucket);
                    onClose();
                  }}
                >
                  {Yes}
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                >
                  {No}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      },
    });
  };

  deleteClick = (deletekey, profile_id, bucket) => {
    this.setState({ loaderImage: true });
    const user_token = this.props.stateLoginValueAim.token;
    axios
      .delete(
        sitedata.data.path +
          '/admin/deleteUser/' +
          deletekey +
          '?bucket=' +
          bucket,
        commonHeader(user_token)
      )
      .then((response) => {
        this.setState({ loaderImage: false });
        var data = JSON.stringify({ permanent: true });

        // var config = {
        //   method: 'delete',
        //   url:
        //     'https://api-eu.cometchat.io/v2.0/users/' +
        //     profile_id.toLowerCase(),
        //   headers: commonCometDelHeader(),
        //   data: data,
        // };

        // axios(config)
        //   .then(function (response) {})
        //   .catch(function (error) {});
        this.getDoctors();
      });
  };

  onChangePage = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, () => {
      this.getDoctors();
    });
  };

  assignHouse = (patient) => {
    this.setState({ openHouse: true, current_user: patient });
  };

  closeHouse = () => {
    this.setState({ openHouse: false });
  };

  updateEntryState1 = (value, name) => {
    this.setState({ house: value });
  };

  SaveAssignHouse = (authority) => {
    var userid = this.state.current_user._id;
    var housevalue = this.state.house;
    if (housevalue.value) {
        housevalue.roles = authority;
        if(authority?.length>0){
            this.setState({ blankerror: false, selectRole: false,  assignedhouse: false , loaderImage: true})
            axios
            .put(
                sitedata.data.path +
                `/hospitaladmin/assignedHouse/${userid}`,
                this.state.house,
                commonHeader(this.props.stateLoginValueAim.token)
            )
            .then((responce) => {
              var sendSec = { _id: responce.data.data?._id, houses: responce.data.data?.houses};
              var socket =SocketIo();
              socket.emit("Updated",sendSec)
                console.log('sendSec1', sendSec)
                if (responce.data.hassuccessed) {
                    this.setState({ assignedhouse: true, blankerror: false, house: {} })
                    this.getallGroups();
                    this.getDoctors(true);
                    setTimeout(() => {
                        this.setState({ assignedhouse: false, house: {} })
                    }, 5000)
                    this.getallGroups();
                    this.getDoctors(this.state.current_user._id);
                }
                // else {
                //     this.setState({ alredyExist: true })
                //     setTimeout(() => {
                //         this.setState({ alredyExist: false })
                //     }, 5000)
                // }
                this.setState({ loaderImage: false });
            });
        }
        else{
            this.setState({ blankerror: false, selectRole: true,  assignedhouse: false })  
            setTimeout(() => {
                this.setState({ selectRole: false })
            }, 5000)
        }
    }
    else {
        this.setState({ blankerror: true, assignedhouse: false })
        setTimeout(() => {
            this.setState({ blankerror: false })
        }, 5000)
    }
    this.setState({ loaderImage: false });
   
}

  deleteHouse = (deleteId, items) => {
    var userid = this.state.current_user._id;
    this.setState({ loaderImage: true });
    axios
      .delete(
        sitedata.data.path +
          `/hospitaladmin/assignedHouse/${userid}/${deleteId}`,
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((responce) => {
        console.log('delete', responce.data.data)
        var sendSec = { _id: responce.data.data?._id, houses: responce.data.data?.houses};
        var socket =SocketIo();
        socket.emit("delete",sendSec)
        console.log('sendSec2', sendSec)
        if (responce.data.hassuccessed) {
          this.setState({ deleteHouses: true });
          setTimeout(() => {
            this.setState({ deleteHouses: false });
          }, 5000);
          this.getallGroups();
          this.getDoctors(this.state.current_user._id);
        }
        this.setState({ loaderImage: false });
      });
  };

  render() {
    if (this.props.stateLoginValueAim?.user?.type !== 'hospitaladmin') {
      this.props.history.push('/');
    }
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      ManageHouse,
      capab_Doctors,
      add_new,
      srvc_Doctors,
      find_doctor,
      ID,
      Status,
      no_,
      recEmp_FirstName,
      Normal,
      Blocked,
      recEmp_LastName,
      imprint_Email,
      restore,
      Delete,
      see_detail,
      previous,
      next,
      Yes,
      No,
      Currently_available,
    } = translate;
    return (
      <Grid
        className={
          this.props.settings &&
          this.props.settings.setting &&
          this.props.settings.setting.mode &&
          this.props.settings.setting.mode === 'dark'
            ? 'homeBg darkTheme'
            : 'homeBg'
        }
      >
        {this.state.loaderImage && <Loader />}
        <Grid className="homeBgIner">
          <Grid container direction="row" justify="center">
            <Grid item xs={12} md={12}>
              <Grid container direction="row">
                {/* Mobile menu */}
                <H_LeftMenuMobile isNotShow={true} currentPage="doctor_List" />
                {/* End of mobile menu */}

                {/* Website Menu */}
                <H_LeftMenu isNotShow={true} currentPage="doctor_List" />
                {/* End of Website Menu */}
                <CreateAdminUser
                  addCreate={this.state.addCreate}
                  handleCloseCreate={this.handleCloseCreate}
                  openBy="doctor"
                />

                <Grid item xs={12} md={10} className="adminMenuRghtUpr">
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    className="archvOpinLbl"
                  >
                    <Grid item xs={12} md={6}>
                      <label>{capab_Doctors}</label>
                    </Grid>
                    <Grid item xs={12} md={6} className="archvOpinRght">
                      <a onClick={this.handleOpenCreate}>
                        + {add_new} {srvc_Doctors}
                      </a>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    className="archvSrchInput"
                  >
                    <Grid item xs={12} md={12}>
                      {' '}
                      <input
                        onChange={this.search_user.bind(this)}
                        type="text"
                        placeholder={find_doctor}
                      />
                    </Grid>
                    <img
                      src={require('assets/images/InputField.svg')}
                      alt=""
                      title=""
                    />
                  </Grid>
                  {/* {this.state.assignedhouse && (
                                        <div className="success_message">
                                        House is assigned to doctor
                                        </div>
                                    )}
                                        {this.state.deleteHouse && (
                                        <div className="success_message">
                                        House id deleted from the doctor
                                        </div>
                                    )} */}
                  <Grid className="archvOpinionIner allArchvSection2">
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>{no_}</Th>
                          <Th>{recEmp_FirstName}</Th>
                          <Th>{recEmp_LastName}</Th>
                          <Th>{imprint_Email}</Th>
                          <Th>{ID}</Th>
                          <Th>{Currently_available}</Th>
                          <Th></Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {this.state.MypatientsData &&
                          this.state.MypatientsData.length > 0 &&
                          this.state.MypatientsData.map((doctor, i) => (
                            <Tr>
                              <Td>
                                {(this.state.currentPage - 1) * 20 + i + 1}
                              </Td>
                              <Td className="patentPic">
                                <S3Image imgUrl={doctor?.image} />
                                {doctor.first_name && doctor.first_name}
                              </Td>
                              <Td>{doctor.last_name && doctor.last_name}</Td>
                              <Td>{doctor.email && doctor.email}</Td>
                              <Td>{doctor.alies_id && doctor.alies_id}</Td>
                              {doctor &&
                              doctor?.current_available &&
                              doctor?.current_available === true ? (
                                <Td style={{ minWidth: '100px' }}>
                                  <span className="revwGren"></span>
                                  {Yes}
                                </Td>
                              ) : (
                                <Td style={{ minWidth: '100px' }}>
                                  <span className="revwRed"></span>
                                  {No}
                                </Td>
                              )}
                              {doctor.isblock && doctor.isblock == true ? (
                                <Td style={{ minWidth: '100px' }}>
                                  <span className="revwRed"></span>
                                  {Blocked}
                                </Td>
                              ) : (
                                <Td>
                                  <span className="revwGren"></span>
                                  {Normal}
                                </Td>
                              )}
                              <Td className="billDots">
                                <a className="academy_ul">
                                  <InfoIcon className="infoIconCol" />
                                  <ul className="listBullets">
                                    <li>
                                      <h6 className="assignHos">
                                        Assigned Hospitals
                                      </h6>
                                      {doctor &&
                                      doctor?.houses &&
                                      doctor?.houses?.length > 0 ? (
                                        doctor?.houses.map((item) => (
                                          <div className="assHosList">
                                            {item?.label}
                                          </div>
                                        ))
                                      ) : (
                                        <Grid className="noHosAss">
                                          No hospitals!
                                        </Grid>
                                      )}
                                    </li>
                                  </ul>
                                </a>
                              </Td>
                              <Td className="billDots">
                                <a className="academy_ul">
                                  <img
                                    src={require('assets/virtual_images/threeDots.png')}
                                    alt=""
                                    title=""
                                    className="academyDots"
                                  />
                                  <ul>
                                    <li onClick={() => this.openDetail(doctor)}>
                                      <a>
                                        <span>
                                          <img
                                            src={require('assets/images/admin/details1.svg')}
                                            alt=""
                                            title=""
                                          />
                                        </span>
                                        {see_detail}
                                      </a>
                                    </li>
                                    <li
                                      onClick={() =>
                                        this.BlockUser(
                                          doctor._id,
                                          doctor.isblock
                                        )
                                      }
                                    >
                                      <a>
                                        <span>
                                          <img
                                            src={require('assets/images/admin/restoreIcon.png')}
                                            alt=""
                                            title=""
                                          />
                                        </span>
                                        {doctor.isblock &&
                                        doctor.isblock == true
                                          ? 'Unblock'
                                          : 'Block'}
                                      </a>
                                    </li>
                                    <li
                                      onClick={() => this.assignHouse(doctor)}
                                    >
                                      <a>
                                        <span>
                                          <img
                                            src={require('assets/images/admin/details1.svg')}
                                            alt=""
                                            title=""
                                          />
                                        </span>
                                        {ManageHouse}
                                      </a>
                                    </li>
                                    <li
                                      onClick={() =>
                                        this.submitDelete(
                                          doctor._id,
                                          doctor.profile_id,
                                          doctor.bucket
                                        )
                                      }
                                    >
                                      <a>
                                        <span>
                                          <img
                                            src={require('assets/images/admin/delIcon.png')}
                                            alt=""
                                            title=""
                                          />
                                        </span>
                                        {Delete}
                                      </a>
                                    </li>
                                  </ul>
                                </a>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>

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
                              <Pagination
                                from="userlist"
                                totalPage={this.state.totalPage}
                                currentPage={this.state.currentPage}
                                pages={this.state.pages}
                                onChangePage={(page) => {
                                  this.onChangePage(page);
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <AssignedHouse
                    assignedhouse={this.state.assignedhouse}
                    deleteHouses={this.state.deleteHouses}
                    openHouse={this.state.openHouse}
                    currentHouses={this.state.currentHouses}
                    Housesoptions={this.state.Housesoptions}
                    current_user={this.state.current_user}
                    alredyExist={this.state.alredyExist}
                    blankerror={this.state.blankerror}
                    closeHouse={this.closeHouse}
                    SaveAssignHouse={this.SaveAssignHouse}
                    deleteHouse={this.deleteHouse}
                    updateEntryState1={this.updateEntryState1}
                    selectRole={this.state.selectRole}
                    checkboxdata={this.state.checkboxdata}
                  />
                  <ViewDetail
                    openDetial={this.state.openDetial}
                    CloseDetail={this.CloseDetail}
                    patient_info={this.state.current_user}
                  />
                </Grid>
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
  connect(mapStateToProps, {
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    OptionList,
  })(Index)
);
