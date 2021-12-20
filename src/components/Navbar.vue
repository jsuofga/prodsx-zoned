<template>
  <div class = 'navbar'> 
        <nav class="nav-extended">
                <div class="nav-wrapper">
                    <ul class="hide-on-med-and-down">
                        <li><a @click= "openModal1"><i class="material-icons">menu</i></a></li>
                    </ul>
                    <div  class="brand-logo center"><img src="@/assets/images/octava_logo_white-200.png"> </div>
                    <span id = 'version' class="right">V12.20.21-A&nbsp;&nbsp;</span>
                </div>
        </nav>

        <!-- Modal Structure -->
        <div id="modal1" class="modal center-align">
                <h5 id='admin-settings-title' class = 'center-align'>Admin Access</h5>
                <small>You need administrative privilege to change settings.</small>
                <div class="modal-content-admin">
                    <label for="admin"></label>
                    <i class="material-icons prefix blue-icon">persons</i>
                    <input name="admin" v-model= "admin" placeholder="Enter admin password" type="text" required autocomplete="off">
                </div>

                <div class="modal-footer ">
                    <a @click= "closeModal1" class="modal-close waves-effect waves-light btn red">Cancel</a>
                    <a @click= "submit" class="modal-close waves-effect waves-light btn blue ">Submit</a>
                </div>
        </div>

        <div id="modal2" class="modal">
            <div class="modal-content-settings center-align">
                <ul class = "center-align">
                    <router-link to="/device-list"><li @click= "closeModal2"><i class="material-icons blue-grey-text ">search</i><span>Discover Connected Devices</span> </li></router-link>
                    <router-link to="/name-zones"><li @click= "closeModal2"><i class="material-icons blue-grey-text ">edit</i><span>Zones/Groups</span> </li></router-link>
                    <router-link to="/name-inputs"><li @click= "closeModal2"><i class="material-icons blue-grey-text ">edit</i><span>Video Inputs</span></li></router-link>
                    <router-link to="/name-outputs"><li @click= "closeModal2"><i class="material-icons blue-grey-text ">edit</i><span>Video Outputs</span></li></router-link>
                    <router-link to="/videowallconfig"><li @click= "closeModal2"><i class="material-icons blue-grey-text ">edit</i><span>Video Walls(optional)</span> </li></router-link>
                    <!-- <router-link to="/timer"><li @click= "closeModal2"><i class="material-icons blue-grey-text ">alarm_add</i><span>POE Power</span></li></router-link> -->
                    <li @click= "savePreset(1)" ><router-link to=""><i class="material-icons blue-grey-text "> save</i><span>Save to Preset 1</span></router-link></li>
                    <li @click= "savePreset(2)" ><router-link to=""><i class="material-icons blue-grey-text ">save</i><span>Save to Preset 2</span> </router-link></li>
                    <li @click= "savePreset(3)" ><router-link to=""><i class="material-icons blue-grey-text">save</i><span>Save to Preset 3</span> </router-link></li>
                </ul>
            </div>
            <div class="modal-footer">
                <a id='cancelBtn' @click= "closeModal2" class="modal-close waves-effect waves-light btn red">EXIT</a>
            </div>
        </div>

 </div>
</template>

<script>

export default {
    name: 'Navbar',
    props:["tvNamesZones"],
    data () {
        return {
            admin:'',
            RxFeedback:[]
        }
    },
    watch:{
     
    },
    methods:{
    openModal1(){
        this.modalInstance1.open();
     },
    closeModal1(){
         this.modalInstance1.close();
     },
    submit(){
        this.modalInstance1.close();
            if(this.admin =='octava'){
                this.admin = ''
                this.modalInstance2.open();
            }else{
                alert('No access')
            }
    },
    openModal2(){
        this.modalInstance2.open();
     },
    closeModal2(){
         this.modalInstance2.close();
     },
    savePreset(preset){
 
            this.RxFeedback = [...Array(this.tvNamesZones.length).keys()]
            // Get all RX TX Channel status
            this.tvNamesZones.forEach((item,index)=>{
                console.log(`http://172.31.3.${this.tvNamesZones[index].rxId}/cgi-bin/query.cgi?cmd=astparam g ch_select`)
                fetch(`http://172.31.3.${this.tvNamesZones[index].rxId}/cgi-bin/query.cgi?cmd=astparam g ch_select`)
                .then( res => {
                    return res.text()
                })
                .then( data => {
                    //console.log(data)
                    this.RxFeedback[index] = data.slice(1)  // Feedback is in 4 digit format 0001, need to remove starting 0 for rxswitch : 001 3-digit format
                    this.RxFeedback = JSON.parse(JSON.stringify(this.RxFeedback )) //convert the object of Vue to normal object!  Very strange. Solution suggested by Evan You
                })
            })

            M.toast({ html: `Saving updates`, classes: "rounded blue", displayLength: 5000 });
 
            //  Delay 5 seconds before writing to TX dB. Should use PROMISE ALL next revision.
            setTimeout(()=>{
                
                   // Write to TX1 and save as 'preset1_DB'
                    console.log(`http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam s preset${preset}_DB ` + JSON.stringify(this.RxFeedback))
                    fetch(`http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam s preset${preset}_DB ` + JSON.stringify(this.RxFeedback))
                    .then(function(data) {
                        // Save
                        fetch("http://172.31.2.1/cgi-bin/query.cgi?cmd=astparam save")
                        .then(function(data) {
                             M.toast({ html: `Preset ${preset} Saved`, classes: "rounded green",completeCallback:()=>{this.closeModal2()}})
                        })
                    })
            
            },5000)
     }
        
    },
    mounted(){
        M.AutoInit() // For Materialize to work!
        const modal1 = document.getElementById('modal1')
        this.modalInstance1 = M.Modal.init(modal1);

        const modal2 = document.getElementById('modal2')
        this.modalInstance2 = M.Modal.init(modal2);
    }

}
</script>

<style scoped>
    .nav-extended{
        background-color: rgb(28,28,30,.75);
    }
    img{
        width: 100px;
    }  
    .modal{
        height:80vh;
 
    }
    .modal-content-admin {
        display:flex;
        flex-direction: row;
        justify-content: center ;
        align-items: center ;
        height:30vh
    }     
    .modal-content-settings {
        display:flex;
        justify-content: center ;
        align-items: center ;
    }
    .modal-content-settings li{
        margin:10px;
        border:1px solid #37474f;
        border-radius:8px ;
        padding-top:8px;
        padding-bottom:8px;
        padding-left:20px;
        padding-right:20px; 
    }
    li{
        display:flex;
    }
    span{
          color:#37474f;
    }
    #version{
        color:white;
    }
    li:hover {
        background-color: #b0bec5
    }

</style>