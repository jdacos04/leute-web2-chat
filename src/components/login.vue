<template>
    <v-layout justify-center align-center>
       <v-flex sm8 md5 lg5>
           <v-card>
               <v-toolbar color="xD" dark card>
                   <v-toolbar-title>
                       Ingresar Email y Password
                   </v-toolbar-title>
               </v-toolbar>
               <v-card-text>
                   <v-text-field v-model="email" label="Email"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password"></v-text-field>
               </v-card-text>
               <v-card-text>
                   <v-layout justify-end>
                       <v-btn @click="ingresar" color="asd">ingresar</v-btn>
                   </v-layout>
               </v-card-text>
           </v-card>
           
        </v-flex> 
    </v-layout>
</template>


<script>
import{auth, db} from '@/firebase'
export default {
    data(){
        return{
            email:'',
            password:'',
        }
    },
    methods:{
        async ingresar(){

            if(!this.email){
                this.enviarNotificacion('debes indicar un email','warning')
                return
            }
                if(!this.password){
                    this.enviarNotificacion('debes indicar un password','warnig')
                    return
                }

            try{
                await auth.signInWithEmailAndPassword(this.email,this.password)
                if(auth.currentUser){
                    let uid= auth.currentUser.uid
                    let doc= await db.collection('usuarios')
                            .doc(uid)
                            .get()
                            if(doc.exists){
                                let usuario =doc.data()
                                this.$emit('onIngresar',usuario)
                            }
                            else{
                                this.enviarNotificacion('no se encontro la informacion del usuario','error')
                            }
                }
           
           }catch(error){
               console.log(error)
               
               switch(error.code){
                   case'auth/user-not-fount':
                   case'auth/worng-password':
                   this.enviarNotificacion('usuario no valiod. Porfavor revisar el correo o la contrasena','warning')
                   break

                   default:
                       this.enviarNotificacion('ocurrio un error verificando la informacion','error')
                       break
               }

            }
        },
        enviarNotificacion(mensaje, color){
            this.$emit('onNotificaicon',{mensaje,color})
        }
        
    }
}
</script>