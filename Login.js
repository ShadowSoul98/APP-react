import React, { Component } from 'react'
import { Text, View, Image, StyleSheet,TouchableOpacity, AsyncStorage,ImageBackground} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { NavigationContext } from '@react-navigation/native';
import { Alert } from 'react-native';

export default class Login extends Component {
    static contextType = NavigationContext;
    constructor (props){
        super(props);
        this.state={
            codigo:'',
            nip:'',
        };
    }

    _leedatos = async()=>{
        const navigation1 = this.context;
        const valor = await AsyncStorage.getItem("elementos");
        if(valor!=null){
        let datos = JSON.parse(valor);
        console.log(da[0]);
        navigation1.navigate('Inicio', {cadena: Datos[1]})
        }
    }
    componentDidMount(){
        this._leedatos();
    }


//asaaa
    render() {
        const navigation = this.context;
        const login=() => {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    console.log(xhttp.responseText);
                    var Datos = xhttp.responseText.split(',');
                    if (xhttp.responseText==0){console.log("ERROR");Alert.alert("Error al insertar clave y/o nip");}
                    else{
                        navigation.navigate('Inicio',{cadena: Datos[2], param2: 'bar'});
                        AsyncStorage.setItem('elementos',JSON.stringify([Datos[1], Datos[2]]));
                        var xhttp1 = new XMLHttpRequest();
                        xhttp1.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                // Typical action to be performed when the document is ready:
                                if(this.responseText == '0'){
                                    Alert.alert("Error al insertar clave y/o nip");
                                    navigation.navigate("Login");
                                    AsyncStorage.removeItem("elementos");
                                }
                                else{}
                            }
                        };
                        xhttp1.open("GET", "https://gradational-gold.000webhostapp.com/Alta.php?codigo="+Datos[1]+"&nombre="+Datos[2], true);
                        xhttp1.send();
                    }
                }
            };
            xhttp.open("GET", "http://cuceimobile.tech/Escuela/datosudeg.php?codigo="+this.state.codigo+'&nip='+this.state.nip, true,);
            xhttp.send();
        };
        return (
                <ImageBackground 
                source={require('./imagenes/login.png')}
                style={Styles.image}
                >

                <View style={Styles.cont}>

                <Input
                placeholder="Codigo:"
                leftIcon={{type: 'font-awesome', name: 'user'}}
                //style={Styles.cont}
                onChangeText={value => this.setState({codigo:value})}
                />

                <Input
                placeholder="Nip:"
                leftIcon={{type: 'font-awesome', name: 'lock'}}
                //style={Styles}
                onChangeText={value => this.setState({nip:value})}
                secureTextEntry={true}
                />

                <View>

                <TouchableOpacity
                style={Styles.bit}
                onPress={login}
                />
                </View>
                </View>
                
                </ImageBackground>
        )
    }
}

const Styles=StyleSheet.create({
    image:{
        //width:400,
        height:780,
        marginLeft:0,
    },
    cont:{
        width:320,
        marginLeft:45,
        marginTop: 175,
    },
    texto:{
        fontSize:21,
        textAlign:"center",
    },
    bit:{
        width:124,
        height:50,
        marginLeft:-10,
        marginTop: -10,
        backgroundColor: '#00000000',
    },
})