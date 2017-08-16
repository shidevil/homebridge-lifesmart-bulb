var Service;
var Characteristic;
var HomebridgeAPI;
var noble = require('noble');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HomebridgeAPI = homebridge;

    homebridge.registerAccessory("homebridge-lifesmart-bulb", "lifesmart-bulb", lifesmartBulb);
};


function lifesmartBulb(log, config) {
    var that = this;
    this.log = log;
    this.name = config.name;
    this.ledsStatus = {
        "on" : true,
        "off": false,
    };
    this.mac = config.mac.toLowerCase();

    this.findBulb(this.mac);

    this.informationService = new Service.AccessoryInformation();
        
    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, config.manufacturer || "Light")
        .setCharacteristic(Characteristic.Model, config.model || "Lifesmart")
        .setCharacteristic(Characteristic.SerialNumber, config.serial || "FFA4000007CEC79FDC1C5000000000000");

    this.service = new Service.Lightbulb(this.name);

    this.service.getCharacteristic(Characteristic.On)
        .on('get', this.getState.bind(this));
    this.service.getCharacteristic(Characteristic.On)
        .on('set', this.setState.bind(this));
}

lifesmartBulb.prototype.findBulb = function(mac, callback) {
    var that = this;
    noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
            noble.startScanning();
        } else {
            noble.stopScanning();
        }
    });

    noble.on('discover', function(peripheral,status) {
        if (peripheral.id === mac || peripheral.address === mac) {
            that.log("found my bulb" + peripheral.uuid);
            peripheral.connect(function(error){
                that.log("connected to bulb" + peripheral.uuid);
                peripheral.discoverServices();
                that.log("Discover services all");
                peripheral.writeHandle(0x0012, new Buffer('0e000000000000000000000412020181','hex'), true, function (error){
                    that.log("Desk lamp is on");
                });
                this.peripheral = peripheral;
            });

      };
    });
};

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

lifesmartBulb.prototype.attemptConnect = function(callback){
    if (this.peripheral || peripheral.state == "connected") {
        callback(true);
    } else if (this.peripheral || peripheral.state == "disconnected") {
        this.log("lost connection to bulb. attempting reconnect ...");
        var that = this;
        peripheral.connect(function(error) {
            if (!error) {
                that.log("reconnect was successful");
                callback(true);
            } else {
                that.log("reconnect was unsuccessful");
                callback(false);
            }
        });
    }
}

lifesmartBulb.prototype.setState = function(status, callback) {
            var temp = function(res) {
            if(status==1){
            peripheral.writeHandle(0x0012, new Buffer('0e000000000000000000000412020181','hex'), true, function (error) {
            if (error) that.log('BLE: Write handle Error: ' + error);
            console.log("LifeSmart Bulb On")  
            status==0;
            callback();
        });
            }
           else if(status==0){
peripheral.writeHandle(0x0012, new Buffer('0e000000000000000000000413020180','hex'), false, function (error) {
            if (error) that.log('BLE: Write handle Error: ' + error);
            console.log("LifeSmart Bulb off")  
            status==1; 
            callback(false);
        });
           };
       };

           this.attemptConnect(temp);
           this.ledsStatus.on=status;
        
};

lifesmartBulb.prototype.getState = function(callback) {
    callback(null, this.ledsStatus.on);
};

lifesmartBulb.prototype.getServices = function() {
    return [this.informationService, this.service];
};
