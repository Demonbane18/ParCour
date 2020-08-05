import React, { Component } from "react";
import 'antd/dist/antd.css'
import {Avatar} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../../App.css';
import ProfilePicChanger from './ProfilePicChanger'


class Picture extends Component {
  render(){
    return (<div className="Picture">
              <Avatar size ={64} icon={<UserOutlined />}/>
              <ProfilePicChanger/>
            </div>
            );
      
  }
}
/* const Picture = ({ file, folder, alt }) => (
  <img
    className="picture"
    alt={alt}
    src={require(`../../images/${folder}/${file}`)}
  />
); */

export default Picture;
