# homebridge-lifesmart-bulb
Homebridge Plugin for LifeSmart Bulb

This plug-in enables you to control your Lifesmart bluetooth bulb however does not support RGB/Hue/Brightness as reversing the bluetooth protocol was faced with difficulty. I will not upload this to npm. 

## Installation
1) Download the git
2) cd into the git folder
Run the following command
```
sudo npm -g install
```

## Config.json file

```json
	{
	    "accessory" : "Lifesmart-bulb",
	    "name" : "Lifesmart",
	    "mac" : "xx:xx:xx:xx:xx:xx",
	}
```

| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| accessory     | Required. Has to be "lifesmart-bulb"                                             |
| name          | Required. The name of this accessory. This will appear in your Homekit app         |
| mac           | Required. The mac address of the lifesmart bulb                           |

## Issues

RGB,HUE,Brightness are not working as reversing the bluetooth protocol was faced with difficulty. If anyone requires the bluetooth wireshark protocol. Feel free to ask

## Credit

Thanks to Lucavb for the magicblue-blue-bulb plugin [here](https://github.com/lucavb/homebridge-magic-blue-bulb). I reused the code to make the lifesmart plugin works. 
