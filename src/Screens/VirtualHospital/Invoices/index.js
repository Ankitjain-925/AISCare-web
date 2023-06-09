import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { confirmAlert } from 'react-confirm-alert';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import LeftMenu from 'Screens/Components/Menus/VirtualHospitalMenu/index';
import TaskView from "Screens/Components/VirtualHospitalComponents/TaskView/index";
import LeftMenuMobile from 'Screens/Components/Menus/VirtualHospitalMenu/mobile';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LoginReducerAim } from 'Screens/Login/actions';
import { Settings } from 'Screens/Login/setting';
import { OptionList } from 'Screens/Login/metadataaction';
import axios from 'axios';
import Loader from 'Screens/Components/Loader/index';
import { LanguageFetchReducer } from 'Screens/actions';
import sitedata from 'sitedata';
import Modal from '@material-ui/core/Modal';
import { commonHeader } from 'component/CommonHeader/index';
import { GetLanguageDropdown } from 'Screens/Components/GetMetaData/index.js';
import { authy } from 'Screens/Login/authy.js';
import _ from 'lodash';
import { Invoices } from 'Screens/Login/invoices.js';
import { houseSelect } from '../Institutes/selecthouseaction';
// import InvoicesDownloadPdf from "Screens/Components/VirtualHospitalComponents/InvoicetopData/index";
import VHfield from 'Screens/Components/VirtualHospitalComponents/VHfield/index';
import { getPatientData } from 'Screens/Components/CommonApi/index';
import { Redirect, Route } from 'react-router-dom';
import { PatientMoveFromHouse } from '../PatientFlow/data';
import { getLanguage } from 'translations/index';

const customStyles = {
  control: (base) => ({
    ...base,
    height: 48,
    minHeight: 48,
  }),
};
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      addinvoice: {},
      items: [],
      totalPrice: 0,
      editServ: false,
      users1: {},
      AllStatus: [],
      AllStatus1: [],
      service: {},
      viewCutom: false,
      serviceList1: [],
      selectedPat: {},
      newServiceIndex: false,
      error: '',
      finishError: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.stateLanguageType !== this.props.stateLanguageType) {
      this.getMetadata();
    }
  }
  componentDidMount() {
    this.getMetadata();
    this.getAllServices();
    this.getPatientData();
    if (
      this.props.history.location?.state?.data &&
      this.props.history.location?.state?.data === 'new'
    ) {
      this.setState({ addinvoice: {} });
    } else if (
      this.props.history.location?.state?.data &&
      this.props.history.location?.state?.value === 'duplicate'
    ) {
      var duplicateData = this.props.history.location?.state?.data;
      var duplicatedata2 = {};
      duplicatedata2['invoice_id'] = '';
      duplicatedata2['patient'] = duplicateData.patient;
      duplicatedata2['case_id'] = duplicateData.case_id;
      duplicatedata2['status'] = duplicateData.status;
      duplicatedata2['total_amount'] = duplicateData.total_amount;
      duplicatedata2['house_id'] = duplicateData.house_id;

      var patData = duplicateData.patient;
      this.setState({
        addinvoice: duplicatedata2,
        items: duplicateData.services,
        selectedPat: {
          label: patData.first_name + ' ' + patData.last_name,
          profile_id: patData.profile_id,
          value: patData._id,
        },
      });
      // var patientName = this.props.history.location?.state?.data.filter((item) => item.patient)
    } else if (
      this.props.history.location?.state?.data?.addinvoice &&
      this.props.history.location?.state?.data
    ) {
      var newdata = this.props.history.location?.state?.data;
      // how to delete the field of onject in js
      this.setState({ addinvoice: newdata });
    }
  }

  //get list of list
  getMetadata = () => {
    this.setState({ allMetadata: this.props.metadata }, () => {
      this.GetLanguageMetadata();
    });
  };

  //Get All status
  GetLanguageMetadata = () => {
    var AllStatus1 = GetLanguageDropdown(
      this.state.allMetadata &&
      this.state.allMetadata.billing_status &&
      this.state.allMetadata.billing_status.length > 0 &&
      this.state.allMetadata.billing_status,
      this.props.stateLanguageType
    );
    var AllStatus = _.cloneDeep(AllStatus1);
    AllStatus.map((item, index) => {
      item.label =
        item.value === 'paid' ? (
          <>
            <span className="revwGren"></span>
            <span>{item.label}</span>
          </>
        ) : item.value === 'draft' ? (
          <>
            <span className="revwGry"></span>
            <span>{item.label}</span>
          </>
        ) : item.value === 'issued' ? (
          <>
            <span className="revwYelow"></span>
            <span>{item.label}</span>
          </>
        ) : (
          <>
            <span className="revwRed"></span>
            <span>{item.label}</span>
          </>
        );
    });

    this.setState({
      AllStatus: AllStatus,
      AllStatus1: AllStatus1,
    });
  };

  //Get patient list
  getPatientData = async () => {
    this.setState({ loaderImage: true });
    let response = await getPatientData(
      this.props.stateLoginValueAim.token,
      this.props?.House?.value,
      'invoice'
    );
    if (response.isdata) {
      this.setState({
        users1: response.PatientList1,
        users: response.patientArray,
        loaderImage: false,
      });
    } else {
      this.setState({ loaderImage: false });
    }
  };

  //get services list
  getAllServices = () => {
    var serviceList = [],
      serviceList1 = [];
    axios
      .get(
        sitedata.data.path + '/vh/GetService/' + this.props?.House?.value,
        commonHeader(this.props.stateLoginValueAim.token)
      )
      .then((response) => {
        this.setState({ allServData: response.data.data });
        for (let i = 0; i < this.state.allServData.length; i++) {
          serviceList1.push(this.state.allServData[i]);
          serviceList.push({
            price: this.state.allServData[i].price,
            description: this.state.allServData[i].description,
            value: this.state.allServData[i]._id,
            label: this.state.allServData[i]?.title,
          });
        }
        var addCustom = <div className="addCustom">+ add custom service</div>;
        serviceList = [{ value: 'custom', label: addCustom }, ...serviceList];
        this.setState({
          service_id_list: serviceList,
          serviceList1: serviceList1,
        });
      });
  };

  // Set the select data
  onFieldChange = (e, name) => {
    const state = this.state.service;
    if (name === 'service') {
      if (e.value === 'custom') {
        this.setState({ viewCutom: true });
      } else {
        this.setState({ viewCutom: false });
      }
      state['price_per_quantity'] = e.price;
      state['quantity'] = 1;
      state[name] = e;
    } else {
      state[name] = e;
    }

    this.setState({ service: state });
  };

  // Set patient and status data
  onFieldChange1 = (e, name) => {
    const state = this.state.addinvoice;
    if (name === 'patient') {
      var checkCase = this.state.users.filter(
        (item) => item.profile_id === e.profile_id
      );
      if (checkCase && checkCase.length > 0) {
        state[name] = checkCase[0];
        state['case_id'] = checkCase[0].case_id;
        this.setState({ selectedPat: e, loaderImage: true });
        axios
          .get(
            sitedata.data.path + '/vc/GetTaskandService/' + checkCase[0].case_id,
            commonHeader(this.props.stateLoginValueAim.token)
          )
          .then((responce) => {
            this.setState({ AllTask: responce?.data?.data?.Task, loaderImage: false })
            let ServiceDeep = _.cloneDeep(responce?.data?.data?.assigned_service)
            var items = [], sum = 0;
            ServiceDeep?.length > 0 && ServiceDeep.map((item) => {
              sum = parseInt(item.amount) + sum;
              return item?.assign_service?.length > 0 && item?.assign_service.map((item2) => {
                item2.title = item.title
                item2.assigned_service_id = item?._id
                items.push(item2);
              })
            })
            state['total_amount'] = sum;
            this.setState({ AllTask: responce?.data?.data?.Task, items: items })
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      state[name] = e;
    }
    this.setState({ addinvoice: state });
  };

  // Set the state of quantity and price_per_quantity
  updateEntryState1 = (e, name) => {
    const state = this.state.service;
    state[name] = e.target.value;
    this.setState({ service: state });
  };

  updateEntryState2 = (e, name) => {
    const state = this.state.addinvoice;
    state[name] = e.target.value;
    this.setState({ addinvoice: state });
  };

  //Add the services
  // handleAddSubmit = () => {
  //   let translate = getLanguage(this.props.stateLanguageType);
  //   let {
  //     Ser_already_exists,
  //     Please_enter_valid_price,
  //     Custom_service_title_cant_be_empty,
  //   } = translate;
  //   this.setState({ error: '' });
  //   var newService = this.state.service;
  //   var a =
  //     this.state.items &&
  //     this.state.items?.length > 0 &&
  //     this.state.items.map((element) => {
  //       return element?.service;
  //     });
  //   var b = a?.length > 0 && a.includes(this.state.service?.service?.label);
  //   if (b == true) {
  //     this.setState({ error: Ser_already_exists });
  //   } else {
  //     if (newService?.service?.value == 'custom') {
  //       if (
  //         newService?.price_per_quantity < 1 ||
  //         !newService?.price_per_quantity
  //       ) {
  //         this.setState({ error: Please_enter_valid_price });
  //       } else {
  //         if (newService && !newService?.custom_title) {
  //           this.setState({ error: Custom_service_title_cant_be_empty });
  //         } else {
  //           newService.price =
  //             newService?.price_per_quantity * newService?.quantity;
  //           newService.service = newService?.custom_title;
  //           let items = [...this.state.items];
  //           items.push(newService);
  //           let data = {};
  //           data['house_id'] = this.props?.House?.value;
  //           data['description'] = newService?.custom_description;
  //           data['price'] = newService?.price_per_quantity;
  //           data['title'] = newService?.custom_title;
  //           axios
  //             .post(
  //               sitedata.data.path + '/vh/AddService',
  //               data,
  //               commonHeader(this.props.stateLoginValueAim.token)
  //             )
  //             .then((responce) => {
  //               this.getAllServices();
  //             })
  //             .catch(function (error) {
  //               console.log(error);
  //             });

  //           this.setState({ items, service: {} }, () => {
  //             this.updateTotalPrize();
  //           });
  //         }
  //       }
  //     } else {
  //       newService.price =
  //         newService?.price_per_quantity * newService?.quantity;
  //       newService.service = this.state.service?.service?.label;
  //       let items = [...this.state.items];
  //       items.push(newService);
  //       this.setState({ items, service: {} }, () => {
  //         this.updateTotalPrize();
  //       });
  //     }
  //   }
  // };

  //Update the services
  // handleAddUpdate = () => {
  //   var newService = this.state.service;
  //   newService.price = newService?.price_per_quantity * newService?.quantity;
  //   var index = this.state.newServiceIndex;
  //   var array = this.state.items;
  //   array[index].price = newService?.price;
  //   array[index].quantity = newService?.quantity;
  //   this.updateTotalPrize();
  //   this.setState({ service: {}, newServiceIndex: false, editServ: false });
  // };

  // updateTotalPrize = () => {
  //   var newService = this.state.addinvoice;
  //   var total = 0;
  //   this.state.items?.length > 0 &&
  //     this.state.items.map((data) => {
  //       if (data && data?.price) {
  //         total = total + data?.price;
  //       }
  //     });
  //   newService.total_amount = total;
  //   this.setState({ addinvoice: newService });
  // };

  // For edit service
  // editService = (data, index) => {
  //   var deep = _.cloneDeep(data);
  //   this.setState({ service: deep, newServiceIndex: index, editServ: true });
  // };

  // handleCloseServ = () => {
  //   this.setState({ editServ: false, service: {} });
  // };


  Billing = () => {
    this.props.history.push('/virtualHospital/bills');
  };

  // For calculate value of finish invoice
  finishInvoice = (draft) => {
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      Invoice_Id_cant_be_empty,
      Please_select_patient,
      can_add_invoice,
      Please_add_atleast_one_service,
      Invoice_Id_is_already_exists,
    } = translate;
    this.setState({ finishError: '' });
    var data = this.state.addinvoice;
    data.status =
      this.state.AllStatus1 &&
      this.state.AllStatus1.filter(
        (item) => item.value === 'issued'
      )?.[0];
    // if (draft) {
    //   data.status =
    //     this.state.AllStatus1 &&
    //     this.state.AllStatus1.filter((item) => item.value === 'draft')?.[0];
    // }
    // if(data._id){
    //     this.setState({ loaderImage: true });
    //     axios
    // .post(
    //   sitedata.data.path + `/vh/addInvoice/${data._id}`,
    //   data,
    //   commonHeader(this.props.stateLoginValueAim.token)
    // )
    // .then((responce) => {
    //   this.setState({ loaderImage: false });
    //   if (responce.data.hassuccessed) {
    //     this.setState({
    //         addinvoice : {}, selectedPat: {},
    //     });
    //     this.props.getAddTaskData();
    //   }
    // })
    // .catch(function (error) {
    //     this.setState({ loaderImage: false })``;
    // });
    // }
    // else {
    data.house_id = this.props?.House?.value;
    data.services = this.state.items;
    data.created_at = new Date();

    if (!data.invoice_id) {
      this.setState({ finishError: Invoice_Id_cant_be_empty });
    } else if (!data.patient || (data.patient && data.patient.length < 1)) {
      this.setState({ finishError: Please_select_patient });
    } else if (!data.services || (data.services && data.services.length < 1)) {
      this.setState({ finishError: can_add_invoice });
    } else {
      this.setState({ loaderImage: true });
      axios
        .post(
          sitedata.data.path + '/vh/addInvoice',
          data,
          commonHeader(this.props.stateLoginValueAim.token)
        )
        .then((responce) => {
          this.setState({ loaderImage: false });
          if (responce.data.hassuccessed) {
            if (data.status.value == 'paid') {
              PatientMoveFromHouse(
                data.case_id,
                this.props.stateLoginValueAim.token,
                2,
                false,
                true
              );
            } else if (data.status.value == 'overdue') {
              PatientMoveFromHouse(
                data.case_id,
                this.props.stateLoginValueAim.token,
                3
              );
            }
            this.setState({
              items: [],
              addinvoice: {},
              selectedPat: {},
            });
            this.Billing();
          } else {
            this.setState({ finishError: Invoice_Id_is_already_exists });
          }
        })
        .catch((error) => {
          this.setState({ loaderImage: false });
        });
    }
    // }
  };

  //Delete the perticular service confirmation box
  removeServices = (id) => {
    this.setState({ message: null });
    let translate = getLanguage(this.props.stateLanguageType);
    let { RemoveService, sure_remove_service_from_invoice, No, Yes } =
      translate;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div
            className={
              this.props.settings &&
                this.props.settings.setting &&
                this.props.settings.setting.mode &&
                this.props.settings.setting.mode === 'dark'
                ? 'dark-confirm react-confirm-alert-body'
                : 'react-confirm-alert-body'
            }
          >
            <h1>{RemoveService}</h1>

            <p>{sure_remove_service_from_invoice}</p>
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>{No}</button>
              <button
                onClick={() => {
                  this.deleteClickService(id);
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

  // deleteClickService(id) {
  //   // delete this.state.items[id]
  //   this.state.items.splice(id, 1);
  //   this.setState({ items: this.state.items });
  //   var newService = this.state.service;
  //   newService.price = newService?.price_per_quantity * newService?.quantity;
  //   newService.service = this.state.service?.service?.label;
  //   let items = [...this.state.items];
  //   this.setState({ items, service: {} }, () => {
  //     this.updateTotalPrize();
  //   });

  // this.finishInvoice();
  // }

  render() {
    const { stateLoginValueAim, House } = this.props;
    if (
      stateLoginValueAim.user === 'undefined' ||
      stateLoginValueAim.token === 450 ||
      stateLoginValueAim.token === 'undefined' ||
      stateLoginValueAim.user.type !== 'adminstaff'
    ) {
      return <Redirect to={'/'} />;
    }
    if (House && House?.value === null) {
      return <Redirect to={'/VirtualHospital/institutes'} />;
    }
    let translate = getLanguage(this.props.stateLanguageType);
    let {
      InvoiceID,
      Patient,
      Status,
      Services,
      srvc,
      qty,
      Price,
      Add,
      FinishInvoice,
      SaveDraft,
      Addservice,
      BacktoBilling,
      Customservicetitle,
      Customservicedescription,
      Editservice,
      InvoiceAmount,
      save_and_close,
      Search_Select,
      Draft,
      Searchserviceoraddcustominput,
      Enterquantity,
      Enterprice,
      EnterTitlename,
      Enterserviceprice,
      Quantity,
      Priceperquantity,
      Servicename,
    } = translate;
    const { selectedOption } = this.state;
    const { addinvoice } = this.state;
    const { House: { roles = [] } = {} } = this.props || {}
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
          <Grid container direction="row">
            <Grid item xs={12} md={12}>
              <LeftMenuMobile isNotShow={true} currentPage="more" />
              <Grid container direction="row">
                {/* <VHfield service="ANkit" Onclick2={(service, value)=>{this.myclick(service , value)}}/> */}
                {/* Start of Menu */}
                <Grid item xs={12} md={1} className="MenuLeftUpr">
                  <LeftMenu isNotShow={true} currentPage="more" />
                </Grid>
                {/* End of Menu */}
                {/* Start of Right Section */}
                <Grid item xs={12} md={11}>
                  <Grid className="topLeftSpc">
                    {/* Back common button */}
                    <Grid className="extSetting">
                      <a onClick={this.Billing}>
                        <img
                          src={require('assets/virtual_images/rightArrow.png')}
                          alt=""
                          title=""
                        />
                        {BacktoBilling}
                      </a>
                    </Grid>
                    {/* End of Back common button */}
                    {/* {this.state.addinvoice?._id &&
                                            <InvoicesDownloadPdf
                                                label={this.state.addinvoice?.invoice_id}
                                                status={this.state.addinvoice?.status?.label}
                                                InvoicesData={this.state.addinvoice}
                                            />
                                        } */}

                    {roles.includes("add_invoice") &&
                      <Grid className="srvcContent">
                        <Grid className="invoiceForm">
                          <p className="err_message">{this.state.finishError}</p>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={3}
                          >
                            {/* <label>{InvoiceID}</label> */}
                            <Grid item xs={12} md={3} className="invoiceID">
                              <label>{InvoiceID}</label>
                              {/* <TextField placeholder="Invoice ID" value="548756" /> */}
                              <VHfield
                                name="invoice_id"
                                placeholder={InvoiceID}
                                onChange={(e) =>
                                  this.onFieldChange1(
                                    e.target.value,
                                    'invoice_id'
                                  )
                                }
                                value={this.state.addinvoice?.invoice_id || ''}
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <label>{Patient}</label>
                              <Grid>
                                <Select
                                  name="patient"
                                  options={this.state.users1}
                                  placeholder={Search_Select}
                                  onChange={(e) =>
                                    this.onFieldChange1(e, 'patient')
                                  }
                                  value={this.state.selectedPat || ''}
                                  className="addStafSelect"
                                  isMulti={false}
                                  isSearchable={true}
                                />
                              </Grid>
                            </Grid>

                            {/* <Grid item xs={12} md={3}>
                            <label>{Status}</label>
                            <Select
                              name="status"
                              placeholder={
                                <>
                                  <span className="revwGry"></span>
                                  <span>{Draft}</span>
                                </>
                              }
                              onChange={(e) => this.onFieldChange1(e, 'status')}
                              value={this.state.addinvoice?.status || ''}
                              options={this.state.AllStatus}
                              className="cstmSelect"
                              isSearchable={false}
                              styles={customStyles}
                            />
                          </Grid> */}
                          </Grid>
                        </Grid>

                        <Grid className="srvcTable">
                          <h3>{"Tasks"}</h3>
                          {this.state.AllTask?.length > 0 && this.state.AllTask.map((data) => (
                            <TaskView
                              removeAddbutton={true}
                              data={data}
                              removeTask={(id) => { }}
                              editTask={(data) => { }}
                              declineTask={(id, patient_id) => { }}
                              DoneAppointment={() => { }}
                              handleApprovedDetails={(id, status, data) => { }}
                              comesFrom={'adminstaff'}
                              removeMorebutton={true}
                            />

                          ))}
                          <h3>{Services}</h3>
                          <Table>
                            <Thead>
                              <Tr>
                                <Th>{srvc}</Th>
                                <Th>{qty}</Th>
                                <Th>{Price}</Th>
                                <Th></Th>
                              </Tr>
                            </Thead>

                            {this.state.items?.length > 0 &&
                              this.state.items.map((data, id) => (
                                <Tbody>
                                  {data && data?.quantity && (
                                    <Tr>
                                      <Td>
                                        <h1>{data?.title}</h1>
                                        <label>
                                          {data?.service}
                                        </label>
                                        <p>{data?.service?.description}</p>
                                      </Td>
                                      <Td>{data?.quantity}</Td>
                                      <Td>{data?.price} €</Td>
                                      {/* <Td className="xRay-edit">
                                      <Button
                                        onClick={() => {
                                          this.editService(data, id);
                                        }}
                                      >
                                        <img
                                          src={require('assets/virtual_images/pencil-1.svg')}
                                          alt=""
                                          title=""
                                        />
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          this.removeServices(id);
                                        }}
                                      >
                                        <img
                                          src={require('assets/virtual_images/bin.svg')}
                                          alt=""
                                          title=""
                                        />
                                      </Button>
                                    </Td> */}
                                    </Tr>
                                  )}
                                </Tbody>
                              ))}
                          </Table>
                        </Grid>

                        {/* <Grid className="srvcTable">
                        <Grid className="addCstmField">
                          <p className="err_message">{this.state.error}</p>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={3}
                          >
                            <Grid item xs={12} md={4}>
                              <label>{Addservice}</label>

                              <Select
                                value={this.state.service?.service || ''}
                                name="service"
                                onChange={(e) =>
                                  this.onFieldChange(e, 'service')
                                }
                                options={this.state.service_id_list}
                                placeholder={Searchserviceoraddcustominput}
                                className="cstmSelect"
                                isSearchable={true}
                                styles={customStyles}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <VHfield
                                label={Quantity}
                                name="quantity"
                                placeholder={Enterquantity}
                                onChange={(e) =>
                                  this.onFieldChange(e.target.value, 'quantity')
                                }
                                value={this.state.service?.quantity || 0}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={2}
                              className="enterPricePart1"
                            >
                              <VHfield
                                label={Priceperquantity}
                                name="per_quantity"
                                placeholder={Enterprice}
                                onChange={(e) =>
                                  this.onFieldChange(
                                    e.target.value,
                                    'price_per_quantity'
                                  )
                                }
                                value={
                                  this.state?.service?.price_per_quantity || 0
                                }
                              />
                              <p className="enterPricePart2">€</p>
                            </Grid>
                            <Grid item xs={12} md={2} className="addSrvcBtn">
                              <Button onClick={this.handleAddSubmit}>
                                {Add}
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        {this.state.viewCutom && (
                          <Grid className="addCstmField">
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              spacing={3}
                            >
                              <Grid item xs={12} md={4}>
                                <label>{Customservicetitle}</label>
                                <TextField
                                  placeholder={Customservicetitle}
                                  name="custom_title"
                                  onChange={(e) =>
                                    this.onFieldChange(
                                      e.target.value,
                                      'custom_title'
                                    )
                                  }
                                  value={this.state.service?.custom_title || ''}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <label>{Customservicedescription}</label>
                                <TextField
                                  placeholder={Customservicedescription}
                                  name="custom_description"
                                  onChange={(e) =>
                                    this.onFieldChange(
                                      e.target.value,
                                      'custom_description'
                                    )
                                  }
                                  value={
                                    this.state.service?.custom_description || ''
                                  }
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        )}
                      </Grid> */}
                        <Grid className="invoiceAmnt">
                          <p>{InvoiceAmount}</p>
                          <label>{this.state.addinvoice.total_amount} €</label>
                          <Grid>
                            <Button
                              onClick={() => {
                                this.finishInvoice();
                              }}
                            >
                              {FinishInvoice}
                            </Button>
                            {/* <Button
                            onClick={() => {
                              this.finishInvoice('draft');
                            }}
                          >
                            {SaveDraft}
                          </Button> */}
                          </Grid>
                        </Grid>
                      </Grid>}
                    {/* End of Billing New Invoice */}

                    {/* <Modal
                      open={this.state.editServ}
                      onClose={this.handleCloseServ}
                      className={
                        this.props.settings &&
                        this.props.settings.setting &&
                        this.props.settings.setting.mode &&
                        this.props.settings.setting.mode === 'dark'
                          ? 'darkTheme addSpeclModel'
                          : 'addSpeclModel'
                      }
                    >
                      <Grid className="addServContnt">
                        <Grid className="addSpeclLbl">
                        <Grid container direction="row" justify="center">
    <Grid item xs={8} md={8} lg={8}>
        <label>{Editservice}</label>
    </Grid>
    <Grid item xs={4} md={4} lg={4}>
        <Grid>
        <Grid className="entryCloseBtn">
            <a onClick={this.handleCloseServ}>
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
                          <Grid className="enterSpcl">
                            <Grid>
                              <VHfield
                                label={Servicename}
                                name="label"
                                placeholder={EnterTitlename}
                                disabled={true}
                                value={this.state.service?.service}
                              />
                            </Grid>

                            <Grid>
                              <VHfield
                                label={Quantity}
                                name="quantity"
                                placeholder={Enterquantity}
                                onChange={(e) =>
                                  this.updateEntryState1(e, 'quantity')
                                }
                                value={this.state.service?.quantity}
                              />
                            </Grid>

                            <Grid>
                              <VHfield
                                label={Price}
                                name="price"
                                placeholder={Enterserviceprice}
                                onChange={(e) =>
                                  this.updateEntryState1(
                                    e,
                                    'price_per_quantity'
                                  )
                                }
                                value={this.state.service?.price_per_quantity}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid className="servSaveBtn">
                          <a onClick={this.handleCloseServ}>
                            <Button onClick={() => this.handleAddUpdate()}>
                              {save_and_close}
                            </Button>
                          </a>
                        </Grid>
                      </Grid>
                    </Modal> */}
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
  const { metadata } = state.OptionList;
  return {
    stateLanguageType,
    stateLoginValueAim,
    loadingaIndicatoranswerdetail,
    House,
    settings,
    verifyCode,
    metadata,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    LoginReducerAim,
    LanguageFetchReducer,
    Settings,
    authy,
    houseSelect,
    Invoices,
    OptionList,
  })(Index)
);
