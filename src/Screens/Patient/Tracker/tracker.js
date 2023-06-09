import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Tabs from '@material-ui/core/Tabs';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { LoginReducerAim } from 'Screens/Login/actions';
import { LanguageFetchReducer } from 'Screens/actions';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Settings } from 'Screens/Login/setting';
import { Fitbit } from './fitbit.js';
import { Withings } from './withing.js';
import { Redirect } from 'react-router-dom';
import { authy } from 'Screens/Login/authy.js';
import Modal from '@material-ui/core/Modal';
import LeftMenu from 'Screens/Components/Menus/PatientLeftMenu/index';
import axios from "axios"
import Highcharts from "highcharts/highstock";
import Battery30Icon from '@material-ui/icons/Battery30';
import Battery60Icon from '@material-ui/icons/Battery60';
import Battery90Icon from '@material-ui/icons/Battery90';
import HighchartsReact from "highcharts-react-official";
import { getDesc } from "Screens/Components/BasicMethod/index"
import LeftMenuMobile from 'Screens/Components/Menus/PatientLeftMenu/mobile';
import { getLanguage } from "translations/index"
// import Notification from "Screens/Components/CometChat/react-chat-ui-kit/CometChat/components/Notifications";

const withingsMeasureType = {
    Weight: 1,
    Height: 4,
    FatFreeMass: 5,
    FatRatio: 6,
    FatMassWeight: 8,
    DiastolicBloodPressure: 9,
    SystolicBloodPressure: 10,
    HeartPulse: 11,
    Temperature: 12,
    SP02: 54,
    BodyTemperature: 71,
    SkinTemperature: 73,
    MuscleMass: 76,
    Hydration: 77,
    BoneMass: 88,
    PulseWaveVelocity: 91,
};
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
            value: 0,
            openSrvc: false,
            vData: false,
            fitbitloggedIn: false,
            withingsloggedIn: false,
            garminloggedIn: false,
            apidata: []
        };
    }


    componentDidMount() {
        if (window.location.hash) {
            let fitbitToken = window.location.hash.slice(1).split("&")[0].replace("access_token=", "")
            this.setState({ fitbitloggedIn: true})
            this.fetchFitbitData("devices.json", fitbitToken, "device")
            this.fetchFitbitData("profile.json", fitbitToken, "user")
            this.fetchFitbitData('activities.json', fitbitToken, 'lifetimeStats')
            this.fetchFitbitData('badges.json', fitbitToken, 'badges')
            this.fetchFitbitData('activities/steps/date/today/1m.json', fitbitToken, 'steps')
            this.fetchFitbitData('activities/distance/date/today/1m.json', fitbitToken, 'distance')   
        }
        if (decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("code").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")) && decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("state").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"))) {
            var code = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("code").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
            this.setState({ code: code })
            this.getDevice(code);
            this.getUser(code)
        }
    }
    // fetch fitbit data from call back url
    fetchFitbitData = async (url, fitbitToken, stateKey) =>{
        await  axios({
            method: 'get',
            url: 'https://api.fitbit.com/1/user/-/' + url,
            headers: { 'Authorization': 'Bearer ' + fitbitToken },
            mode: 'cors'
        })
        .then(response => {
            const state = this.props.fitbit;
            state[stateKey] = response.data;
            this.setState({ apidata: state });
            this.props.Fitbit({
            ...this.props.fitbit,
            ...state,
            });
        })
        .catch(error =>{})
    }

    backDate = (backmonth = 6) => {
        let today = new Date(Date.now());
        let month, date, year;
        year = today.getFullYear();
        month = today.getMonth();
        date = today.getDate();
        if (month - backmonth <= 0) year = today.getFullYear() - 1;
        let backdate = new Date(year, month - backmonth, date);
        return backdate;
    };
    toTimestamp = (strDate) => {
        return Math.round(new Date(strDate).getTime() / 1000);
    }
    formatDate = (unix_timestamp) => {
        var date = new Date(unix_timestamp * 1000);
        var d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return [year, month, day].join("/");
    }
    //GET WITHINGS DEVICES & DATA
    getUser = (code) => {
        axios.post("https://wbsapi.withings.net/v2/user",
        {
            headers: {
                Authorization: "Bearer " + code,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(res => { })
    }
    getDevice = (code) => {
        axios.get("https://wbsapi.withings.net/v2/user?action=getdevice",
            {
                headers: {
                    Authorization: "Bearer " + code,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res) => {
            if (res.data && res.data.body && res.data.body.devices) {
                this.setState({ Devices_id: res.data.body.devices },()=>{
                    this.getMeassure(code)
                })
            }
        })
    }
    // GET WITHINGS MEASURE
    getMeassure = (code) => {
        axios.get('https://wbsapi.withings.net/measure?action=getmeas&startdate=' + this.toTimestamp(this.backDate(6)) + '&enddate=' + this.toTimestamp(new Date()), {
            headers: {
                'Authorization': 'Bearer ' + code,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            this.props.Withings({data: {Devices_id: this.state.Devices_id , measure: response.data.body}});
        })
    }
    //Logout user
    tracker() {
        this.props.history.push('/patient/tracker')
    }
    logoutfromall = (comesfrom) => {
        this.setState({ fitbitloggedIn: false, loggedin: false, withingsloggedIn: false, vData:false })
        this.tracker();
    }
    handleChangeTabs = (event, value) => {
        this.setState({ value });
    };
    // fancybox open
    handleOpenSrvc = () => {
        this.setState({ openSrvc: true });
    };
    handleCloseSrvc = () => {
        this.setState({ openSrvc: false, withingsloggedIn : false, fitbitloggedIn: false });
    };
    handleOpenvData = (device, type) => {
        if (type === 'withing') {
            this.GetDATA(this.props.withing.data.data.measure, device.deviceid)
            this.setState({ withingsDevice: device, fitbitloggedIn: false, withingsloggedIn: true,  })
        } else ( this.setState({ fitbitDevice: device, fitbitloggedIn : true, withingsloggedIn: false }))
        this.setState({ vData: true, });
    };
    handleClosevData = () => {
        this.setState({ vData: false });
    };

    GetDATA=(messureData, deviceid)=>{
            let Weight = [], Height = [], FatFreeMass = [], FatRatio = [], FatMassWeight = [], DiastolicBloodPressure = [],
            SystolicBloodPressure = [], HeartPulse = [], Temperature = [], SP02 = [], BodyTemperature = [], FatFreeMassD = [],
            SkinTemperature = [], MuscleMass = [], Hydration = [], BoneMass = [], PulseWaveVelocity = [], SP02D = [],
            TemperatureD = [], HeartPulseD = [], WeightD = [], BoneMassD = [], HydrationD = [], DiastolicBloodPressureD = [];
                  var labels = [], value = [], options = [];
                    if( messureData && messureData.measuregrps && messureData.measuregrps.length > 0) {
                        messureData.measuregrps.sort(getDesc);
                        messureData.measuregrps.map((data) => {
                            if (deviceid === data.deviceid) {
                                if (data.measures && data.measures.length > 0) {
                                    data.measures.map(obj => {
                                        switch (parseInt(obj.type)) {
                                            case withingsMeasureType.Weight:
                                                Weight.push(obj.value / 1000)
                                                WeightD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.HeartPulse:
                                                HeartPulse.push(obj.value / 1000)
                                                HeartPulseD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.Height:
                                                Height.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.Temperature:
                                                Temperature.push(obj.value / 1000)
                                                TemperatureD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.BodyTemperature:
                                                BodyTemperature.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.SkinTemperature:
                                                SkinTemperature.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.BoneMass:
                                                BoneMass.push(obj.value / 1000)
                                                BoneMassD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.FatFreeMass:
                                                FatFreeMass.push(obj.value / 1000)
                                                FatFreeMassD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.MuscleMass:
                                                MuscleMass.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.FatMassWeight:
                                                FatMassWeight.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.Hydration:
                                                Hydration.push(obj.value / 1000)
                                                HydrationD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.PulseWaveVelocity:
                                                PulseWaveVelocity.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.FatRatio:
                                                FatRatio.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.DiastolicBloodPressure:
                                                DiastolicBloodPressure.push(obj.value / 1000)
                                                DiastolicBloodPressureD.push(this.formatDate(data.date))
                                                break;
                                            case withingsMeasureType.SystolicBloodPressure:
                                                SystolicBloodPressure.push(obj.value / 1000)
                                                break;
                                            case withingsMeasureType.SP02:
                                                SP02.push(obj.value / 1000)
                                                SP02D.push(obj.value / 1000)
                                                break;
                                        }
                                    })
                                    labels.push(this.formatDate(data.date));
                                    value.push(data.measures[0].value / 1000);
                                }
                            }
                        });
                    if (DiastolicBloodPressure.length > 0 && SystolicBloodPressure.length > 0) {
                        options.push({
                            title: {
                                text: 'Blood Pressure'
                            },
                            xAxis: {
                                title: {
                                    text: 'Date'
                                },
                                categories: DiastolicBloodPressureD
                            },
                            plotOptions: {
                                series: {
                                    marker: {
                                        enabled: true,
                                        radius: 3
                                    }
                                }
                            },
                            chart: {
                                type: 'spline'
    
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: 'SystolicBloodPressure',
                                data: SystolicBloodPressure
                            },
                            {
                                name: 'DiastolicBloodPressure',
                                data: DiastolicBloodPressure
                            }]
                        })
                    }
                    if (FatMassWeight.length > 0 && FatRatio.length > 0 && FatFreeMass.length > 0) {
                        options.push({
                            title: {
                                text: 'Fats'
                            },
                            xAxis: {
                                title: {
                                    text: 'Date'
                                },
                                categories: FatFreeMassD
                            },
                            plotOptions: {
                                series: {
                                    marker: {
                                        enabled: true,
                                        radius: 3
                                    }
                                }
                            },
                            chart: {
                                type: 'spline'
    
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: "FatMassWeight",
                                data: FatMassWeight,
                                color: "red",
                            },
                            {
                                name: "FatRatio",
                                data: FatRatio,
                                color: "green",
                            },
                            {
                                name: "FatFreeMass",
                                data: FatFreeMass,
                                color: "blue",
                            }]
                        })
                    }
                    options.push({
                        title: {
                            text: 'Temperature'
                        },
                        xAxis: {
                            title: {
                                text: 'Date'
                            },
                            categories: TemperatureD
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true,
                                    radius: 3
                                }
                            }
                        },
                        chart: {
                            type: 'spline'
    
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: "Temperature",
                            data: Temperature,
                            color: "orange",
                        },
                        {
                            name: "BodyTemperature",
                            data: BodyTemperature,
                            color: '#456665'
                        },
                        {
                            name: "SkinTemperature",
                            data: SkinTemperature,
                            color: '#445432',
                        }]
                    })
    
                    options.push({
                        title: {
                            text: 'Mass'
                        },
                        xAxis: {
                            title: {
                                text: 'Date'
                            },
                            categories: BoneMassD
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true,
                                    radius: 3
                                }
                            }
                        },
                        chart: {
                            type: 'spline'
    
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: "BoneMass",
                            data: BoneMass,
                            color: "red",
                        },
                        {
                            name: "MuscleMass",
                            data: MuscleMass,
                            color: 'blue',
                        }]
                    })
                    options.push({
                        title: {
                            text: 'Pulse'
                        },
                        xAxis: {
                            title: {
                                text: 'Date'
                            },
                            categories: HeartPulseD
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true,
                                    radius: 3
                                }
                            }
                        },
                        chart: {
                            type: 'spline'
    
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: "HeartPulse",
                            data: HeartPulse,
                            color: "red",
                        },
                        {
                            name: "PulseWaveVelocity",
                            data: PulseWaveVelocity,
                            color: "orange",
                        }]
                    })
    
                    options.push({
                        title: {
                            text: 'Height/ Weight'
                        },
                        xAxis: {
                            title: {
                                text: 'Date'
                            },
                            categories: WeightD
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true,
                                    radius: 3
                                }
                            }
                        },
                        chart: {
                            type: 'spline'
    
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: "Height",
                            data: Height,
                            color: "red",
                        },
                        {
                            name: "Weight",
                            data: Weight,
                            color: "orange",
                        }]
                    })
                    options.push({
                        title: {
                            text: 'Hydration'
                        },
                        xAxis: {
                            title: {
                                text: 'Date'
                            },
                            categories: HydrationD
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: true,
                                    radius: 3
                                }
                            }
                        },
                        chart: {
                            type: 'spline'
    
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: "Hydration",
                            data: Hydration,
                            color: "yellow",
                        }]
                    })
                    this.setState({ optionsGraph: options })
                }
        }

    render() {
        const { fitbitDevice, withingsDevice, value, fitbitloggedIn, apidata, withingsloggedIn, deviceid } = this.state;
        let translate = getLanguage(this.props.stateLanguageType)
        let { trackers, TrackersDevices, self_data, connect, search_for_device_palce, devices, services, view_data,
            view_details, logout, disconect_device, distance, total, best, steps, badges, earned, on, last,user,
            model, type, timezone, session, ur_connected_device_appear, no_device_connctd, connct_a_device } = translate
        const { stateLoginValueAim } = this.props;
        if (stateLoginValueAim.user === 'undefined' || stateLoginValueAim.token === 450 || stateLoginValueAim.token === 'undefined' || stateLoginValueAim.user.type !== 'patient' || !this.props.verifyCode || !this.props.verifyCode.code) {
            return (<Redirect to={'/'} />);
        }
        return (
            <Grid className={this.props.settings && this.props.settings.setting && this.props.settings.setting.mode && this.props.settings.setting.mode==='dark' ? "homeBg homeBgDrk" : "homeBg"}>
                <Grid className="homeBgIner">
                    <Grid container direction="row" justify="center">
                        <Grid item xs={12} md={12}>
                            <Grid container direction="row">
                                <LeftMenu  isNotShow ={true} currentPage="tracker" />
                                <LeftMenuMobile isNotShow ={true}  currentPage ="tracker"/>
                                {/* <Notification /> */}
                                {/* End of Website Menu */}
                                <Grid item xs={12} md={9}>
                                    <Grid className="docsOpinion">
                                        <Grid container direction="row" className="docsOpinLbl">
                                            <Grid item xs={12} md={6}><label>{trackers} & {self_data}</label></Grid>
                                            <Grid item xs={12} md={6} className="docsOpinRght">
                                                <a onClick={this.handleOpenSrvc}>+ {connect}</a>
                                            </Grid>
                                        </Grid>
                                        <Grid item sm={4}>
                                        </Grid>
                                        {/* Model setup */}
                                        <Modal
                                            open={this.state.openSrvc}
                                            onClose={this.handleCloseSrvc}
                                            className={this.props.settings && this.props.settings.setting && this.props.settings.setting.mode === 'dark' ?"darkTheme srvcBoxModel":"srvcBoxModel"}>
                                            <Grid className="srvcBoxCntnt">
                                                <Grid className="srvcCourse">
                                                <Grid container direction="row" justify="center">
    <Grid item xs={8} md={8} lg={8}>
        <label>{connect} {devices} & {services}</label>
    </Grid>
    <Grid item xs={4} md={4} lg={4}>
        <Grid>
        <Grid className="entryCloseBtn">
            <a onClick={this.handleCloseSrvc}>
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
                                                    <Grid className="srchSrvc">
                                                        <input type="text" placeholder={search_for_device_palce} />
                                                        <img src={require('assets/images/InputField.svg')} alt="" title="" />
                                                    </Grid>
                                                    <Grid container direction="row" spacing={3}>
                                                        <Grid item xs={12} md={3}>
                                                            <Grid className="fitBitSection">
                                                                <Grid className="mainLogo1"><img src={require('assets/images/fitbit.png')} alt="" title="" /></Grid>
                                                                <Grid className="mainLogoAdd">
                                                                    <a href="https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22BNVH&redirect_uri=https%3A%2F%2Fsys.aimedis.io%2Fpatient%2Ftracker&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800">
                                                                        <img src={require('assets/images/add.svg')} alt="" title="" className="addBlue" />
                                                                        <img src={require('assets/images/addgrey.svg')} alt="" title="" className="addGray" />{connect}</a>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <Grid className="fitBitSection">
                                                                <Grid className="mainLogo2"><img src={require('assets/images/within.png')} alt="" title="" /></Grid>
                                                                <Grid className="mainLogoAdd">
                                                                    <a href="https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=198370b3fcf82d7ed5968266d053f376291849d5691751e9987e1d71ae867c92&scope=user.info,user.metrics,user.activity,user.sleepevents&redirect_uri=https://sys.aimedis.io/patient/tracker&state=up">
                                                                        <img src={require('assets/images/add.svg')} alt="" title="" className="addBlue" />
                                                                        <img src={require('assets/images/addgrey.svg')} alt="" title="" className="addGray" />{connect}</a>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Modal>
                                        {/* End of Model setup */}
                                        <Grid className="presPkgIner1">
                                            <AppBar position="static" className="presTabsUpr">
                                                <Grid container direction="row">
                                                    <Grid item xs={8} md={8}>
                                                        <Tabs value={value} onChange={this.handleChangeTabs} className="presTabs">
                                                            <Tab label={TrackersDevices} className="presTabsIner" />
                                                        </Tabs>
                                                    </Grid>
                                                    <Grid item xs={4} md={4} className="presSrch">
                                                        <a><img src={require('assets/images/search-entries.svg')} alt="" title="" /></a>
                                                    </Grid>
                                                </Grid>
                                            </AppBar>
                                        </Grid>
                                        <Grid className="presPkgIner2">
                                            {value === 0 && <TabContainer>
                                                {/* Trackers & Devices Design */}
                                                <Grid className="selfData">
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={3}>
                                                            {this.props.fitbit  && this.props.fitbit.device && this.props.fitbit.device.length===0 &&
                                                                <Grid className="trckSection">
                                                                    <Grid className="trckSecIner" >
                                                                        <Grid style={{ minHeight: "140px" }} >
                                                                            <div style={{ minHeight: "40px" }}></div>
                                                                            < a href="https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22BNVH&redirect_uri=https%3A%2F%2Fsys.aimedis.io%2Fpatient%2Ftracker&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800">
                                                                                <img style={{ maxWidth: "100px" , margin: "10%" }} title="Loggin via Fitbit!" src={require('assets/images/fitbit.png')} alt="" />
                                                                            </a>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        </Grid>
                                                        <Grid container spacing={3}>
                                                            {this.props.fitbit  && this.props.fitbit.device && this.props.fitbit.device.length>0 && this.props.fitbit.device.map(devicedata => (
                                                                <Grid item xs={12} md={3}>
                                                                    <Grid className="trckSection">
                                                                        <Grid className="trckSecIner">
                                                                            <Grid className="trckDots presEditDot scndOptionIner">
                                                                                <a className="openScndhrf">
                                                                                  <img src={require('assets/images/three_dots_t.png')} alt="" title="" className="openScnd" />
                                                                                    <ul>
                                                                                        <li><a onClick={() => this.handleOpenvData(devicedata ,'fitbit')} className="trackView" >{view_details}</a></li>
                                                                                        <li><a onClick={()=>{this.logoutfromall('fitbit')}} className="trackView" >{logout}</a></li>
                                                                                    </ul>
                                                                                </a></Grid>
                                                                            <Grid className="trckLogo"><img src={require('assets/images/fitbit.png')} alt="" title="" /></Grid>
                                                                            <Grid className="trckCntnt">
                                                                                <Grid><label>{apidata.user && apidata.user.user && apidata.user.user.displayName && apidata.user.user.displayName}</label></Grid>
                                                                                <p>{devicedata.deviceVersion}</p>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid className="trackView"><a onClick={() => this.handleOpenvData(devicedata ,'fitbit' )}>{view_data}</a></Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid className="selfData">
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={3}>
                                                        {this.props.withing  && this.props.withing.data && !this.props.withing.data.data &&
                                                                <Grid className="trckSection">
                                                                    <Grid className="trckSecIner" >
                                                                        <Grid className="trckLogo1" style={{ minHeight: "140px" }} >
                                                                            <div style={{ minHeight: "35px" }}></div>
                                                                            < a className="withingsData" href="https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=198370b3fcf82d7ed5968266d053f376291849d5691751e9987e1d71ae867c92&scope=user.info,user.metrics,user.activity,user.sleepevents&redirect_uri=https://sys.aimedis.io/patient/tracker&state=up">
                                                                                <img title="Loggin via Withings!" src={require('assets/images/logo-withings.png')} alt="" />
                                                                            </a>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        </Grid>
                                                        <Grid container spacing={3}>
                                                        {this.props.withing  && this.props.withing.data && this.props.withing.data.data && this.props.withing.data.data.Devices_id && this.props.withing.data.data.Devices_id.length > 0 && this.props.withing.data.data.Devices_id.map((devices, i) => (
                                                                <Grid item xs={12} md={3}>
                                                                    <Grid className="trckSection">
                                                                        <Grid className="trckSecIner">
                                                                            <Grid className="trckDots presEditDot scndOptionIner">
                                                                                <a className="openScndhrf"><img src={require('assets/images/three_dots_t.png')} alt="" title="" className="openScnd" />
                                                                                    <ul>
                                                                                        <li><a onClick={() => this.handleOpenvData(devices, 'withing')} className="trackView" >{view_details}</a></li>
                                                                                        <li><a onClick={()=>{this.logoutfromall('withing')}} className="trackView" >{logout}</a></li>
                                                                                    </ul>
                                                                                </a>
                                                                            </Grid>
                                                                            <Grid className="trckLogo"><img style={{ minHeight: "40px" }} src={require('assets/images/logo-withings.png')} alt="" title="" /></Grid>
                                                                            <Grid className="trckCntnt">
                                                                                <Grid><label>Withings {user} {i + 1}</label></Grid>
                                                                                <p>{devices.model}</p>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid className="trackView"><a onClick={() => this.handleOpenvData(devices, 'withing')}>
                                                                            {view_data}
                                                                        </a></Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            ))
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                {/* Model setup */}
                                                <Modal
                                                    open={this.state.vData}
                                                    onClose={this.handleClosevData}
                                                    className={this.props.settings && this.props.settings.setting && this.props.settings.setting.mode === 'dark' ?"darkTheme datBoxModel":"datBoxModel"}>
                                                    <Grid className="datBoxCntnt">

                                                        <Grid className="datCourse">
                                                            <Grid className="datCloseBtn">
                                                                <a onClick={this.handleClosevData}>
                                                                    <img src={require('assets/images/close-search.svg')} alt="" title="" />
                                                                </a>
                                                            </Grid>
                                                            <Grid className="expndLogo">
                                                                <a><img src={require('assets/images/fitbit.png')} alt="" title="" /></a>
                                                                <a><img src={require('assets/images/within.png')} alt="" title="" /></a>
                                                                <a><img src={require('assets/images/fitbit.png')} alt="" title="" /></a>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid className="editDevice">
                                                            <Grid>
                                                                <Grid className="disCnct">
                                                                    <Grid className="disCnctLft">
                                                                        <Grid>
                                                                            <label>{fitbitloggedIn ? this.props.fitbit  && this.props.fitbit.device && this.props.fitbit.user && this.props.fitbit.user.user && this.props.fitbit.user.user.displayName && this.props.fitbit.user.user.displayName : withingsloggedIn ? "Withings "+devices : ""}
                                                                           
                                                                                <a><img src={require('assets/images/editBlue.png')} alt="" title="" /></a>
                                                                            </label>
                                                                        </Grid>
                                                                        <p>{fitbitloggedIn ? fitbitDevice && fitbitDevice.deviceVersion : withingsloggedIn ? withingsDevice && withingsDevice.model : ""}</p>
                                                                    </Grid>
                                                                    <Grid className="disCnctRght">
                                                                        <a onClick={()=>{this.logoutfromall(fitbitloggedIn ? 'fitbit' : 'withing')}} >{disconect_device}</a>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid className="disCnctContent">
                                                                <Grid container direction="row" justify="center" alignItems="center">
                                                                    <Grid item xs={12} md={8}>
                                                                        <Grid className="trckSection">
                                                                            <Grid className="trckSecIner" >
                                                                                {this.state.fitbitloggedIn && <div>
                                                                                    {this.props.fitbit && this.props.fitbit.lifetimeStats &&
                                                                                        <div>
                                                                                            <h4>{distance}</h4>
                                                                                            <p>{total}: {this.props.fitbit.lifetimeStats.lifetime && this.props.fitbit.lifetimeStats.lifetime.total && this.props.fitbit.lifetimeStats.lifetime.total.distance && this.props.fitbit.lifetimeStats.lifetime.total.distance}</p>
                                                                                            <p>{best}: {this.props.fitbit.lifetimeStats.best && this.props.fitbit.lifetimeStats.best.total && this.props.fitbit.lifetimeStats.best.total.distance && this.props.fitbit.lifetimeStats.best.total.distance.value && this.props.fitbit.lifetimeStats.best.total.distance && this.props.fitbit.lifetimeStats.best.total.distance.value} on {this.props.fitbit.lifetimeStats.best && this.props.fitbit.lifetimeStats.best.total && this.props.fitbit.lifetimeStats.best.total.distance && this.props.fitbit.lifetimeStats.best.total.distance.date && this.props.fitbit.lifetimeStats.best.total.distance.date}</p>
                                                                                            <h4>{steps}</h4>
                                                                                            <p>{total}: {this.props.fitbit.lifetimeStats.lifetime && this.props.fitbit.lifetimeStats.lifetime.total && this.props.fitbit.lifetimeStats.lifetime.total.steps && this.props.fitbit.lifetimeStats.lifetime.total.steps}</p>
                                                                                            <p>{best}: {this.props.fitbit.lifetimeStats.best && this.props.fitbit.lifetimeStats.best.total && this.props.fitbit.lifetimeStats.best.total.steps.value && this.props.fitbit.lifetimeStats.best.total.steps.value} on {this.props.fitbit.lifetimeStats.best && this.props.fitbit.lifetimeStats.best.total && this.props.fitbit.lifetimeStats.best.total.steps && this.props.fitbit.lifetimeStats.best.total.steps.date && this.props.fitbit.lifetimeStats.best.total.steps && this.props.fitbit.lifetimeStats.best.total.steps.date}</p>
                                                                                        </div>}
                                                                                    {this.props.fitbit && this.props.fitbit.badges &&
                                                                                        <h4>{badges}</h4>}
                                                                                    {this.props.fitbit && this.props.fitbit.badges && this.props.fitbit.badges.badges && this.props.fitbit.badges.badges.length > 0 && this.props.fitbit.badges.badges.map((badge, i) => {
                                                                                        return (
                                                                                            <div key={i}>
                                                                                                <h5>{badge.shortName}</h5>
                                                                                                <p><img src={badge.image100px} alt="" /></p>
                                                                                                <p>{badge.description}</p>
                                                                                                <p>{earned} {badge.timesAchieved} times</p>
                                                                                                <p>{last} {on} {badge.dateTime}</p>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>}
                                                                                {this.state.withingsloggedIn &&
                                                                                    <div>
                                                                                        {deviceid &&
                                                                                            <div className="CardView">
                                                                                                <h2>{devices}</h2>
                                                                                                <Grid container className="CardItem">
                                                                                                    <Grid item sm={10}>
                                                                                                        <label>{model} : </label> <span>{deviceid.model}</span>
                                                                                                        <label>{type} : </label> <span>{deviceid.type}</span>
                                                                                                        <label>{timezone} : </label> <span>{deviceid.timezone}</span>
                                                                                                        <label>{last} {session} : </label> <span> {new Date(
                                                                                                            deviceid.last_session_date * 1000
                                                                                                        ).toString()}</span>
                                                                                                    </Grid>
                                                                                                    <Grid item sm={2}>
                                                                                                        {deviceid.battery === "high" && (
                                                                                                            <Battery90Icon style={{ color: 'green', fontSize: '35px' }} />
                                                                                                        )}
                                                                                                        {deviceid.battery === "medium" && (
                                                                                                            <Battery60Icon style={{ color: 'orange', fontSize: '35px' }} />
                                                                                                        )}
                                                                                                        {deviceid.battery === "low" && (
                                                                                                            <Battery30Icon style={{ color: 'red', fontSize: '35px' }} />
                                                                                                        )}
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </div>}
                                                                                        {this.state.optionsGraph && this.state.optionsGraph.length > 0 ? this.state.optionsGraph.map((item1, index) => (
                                                                                            <div className="setMarginforgraph">
                                                                                                <HighchartsReact
                                                                                                    constructorType={"chart"}
                                                                                                    ref={this.chartComponent}
                                                                                                    highcharts={Highcharts}
                                                                                                    options={item1}
                                                                                                />
                                                                                            </div>
                                                                                        )) : ''}
                                                                                    </div>}
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Modal>
                                                {/* End of Trackers & Devices Design */}
                                            </TabContainer>}
                                            {value === 1 && <TabContainer>
                                                <Grid className="noDevices">
                                                    <h1>{no_device_connctd}</h1>
                                                    <p>{ur_connected_device_appear}</p>
                                                    <h3><a>{connct_a_device}</a></h3>
                                                </Grid>
                                            </TabContainer>}
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
    const { stateLoginValueAim, loadingaIndicatoranswerdetail } = state.LoginReducerAim;
    const { stateLanguageType } = state.LanguageReducer;
    const { settings } = state.Settings;
    const { fitbit } = state.Fitbit;
    const { withing } = state.Withings;
    const { verifyCode } = state.authy;
    return {
        stateLanguageType,
        stateLoginValueAim,
        loadingaIndicatoranswerdetail,
        settings,
        fitbit,
        withing,
        verifyCode,
    }
};
export default withRouter(connect(mapStateToProps, { Fitbit, Withings, LoginReducerAim, LanguageFetchReducer, Settings, authy })(Index));