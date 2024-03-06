import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  // ping: 'ping.json',
  login: 'auth/login',
  register: 'auth/register',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  updateProfile: 'auth/profile',
  changePassword: 'auth/change-password',

  myProfile: 'user/profile',
  myRoute: 'user/my-route',
  addRoute: 'user/route',
  region: 'user/region',
  nearby: 'user/nearby',
  nearbyDirection: 'user/nearby/direction',

  post: 'user/post',
  comment: 'user/comment',
  userList: 'user/user-list',
  profile: 'user/profile',
  connection: 'user/my-connection',
  updatePost: 'user/post',
  postDetail: 'user/post-detail',
  follow: 'user/follow',
  userProfile: 'user/user-profile',
  userPost: 'user/user-post',
  userConnection: 'user/connection',
  myGroup: 'user/my-group',
  addGroup: 'user/group',
  leaveGroup: 'user/leave-group',
  removeGroup: 'user/group',
  updateGroup: 'user/group',
  deleteMember: 'user/group/update-member',

  destination: 'admin/destination',
  dashboard: 'admin/dashboard',

  myFollow: 'user/my-follow',

  userFollow: 'user/user-follow',
};

const headersMultipart = {
  'Content-Type': 'multipart/form-data; charset=UTF-8',
};

export const callAPI = async (endpoint, method, header = {}, params = {}, data = {}) => {
  const defaultHeader = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

// export const ping = () => callAPI(urls.ping, 'get');

export const fetchPokemon = () => callAPI(urls.ditto, 'GET');
export const example = (data) => {
  const header = {
    'Content-Type': 'multipart/form-data',
  };
  return callAPI(urls.ditto, 'GET', header, {}, data);
};

export const register = (data) => callAPI(urls.register, 'POST', {}, {}, data);

export const login = (data) => callAPI(urls.login, 'POST', {}, {}, data);

export const forgotPassword = (data) => callAPI(urls.forgotPassword, 'POST', {}, {}, data);

export const changePassword = (data) => callAPI(urls.changePassword, 'PATCH', {}, {}, data);

export const myProfile = () => callAPI(urls.myProfile, 'GET', {}, {}, {});

export const myRoute = () => callAPI(urls.myRoute, 'GET', {}, {}, {});

export const updateProfile = (data) => callAPI(urls.updateProfile, 'PATCH', headersMultipart, {}, data);

export const resetPassword = (data) => callAPI(urls.resetPassword, 'POST', {}, {}, data);

export const region = (provinceId) => callAPI(`${urls.region}/${provinceId}`, 'GET', {}, {}, {});

export const addRoute = (data) => callAPI(urls.addRoute, 'POST', {}, {}, data);

export const nearby = () => callAPI(urls.nearby, 'GET');

export const createPost = (data) => callAPI(urls.post, 'POST', headersMultipart, {}, data);

export const getPost = (query) => callAPI(urls.post, 'GET', {}, query, {});

export const getComment = (postId) => callAPI(`${urls.comment}/${postId}`, 'GET');

export const userList = (query) => callAPI(urls.userList, 'GET', {}, query, {});

export const profile = () => callAPI(urls.profile, 'GET');

export const connection = () => callAPI(urls.connection, 'GET');

export const updatePost = (postId, data) => callAPI(`${urls.updatePost}/${postId}`, 'PATCH', {}, {}, data);

export const getPostDetail = (postId) => callAPI(`${urls.postDetail}/${postId}`, 'GET');

export const follow = (followTo) => callAPI(`${urls.follow}/${followTo}`, 'PATCH');

export const userProfile = (userId) => callAPI(`${urls.userProfile}/${userId}`, 'GET');

export const userPost = (userId, query) => callAPI(`${urls.userPost}/${userId}`, 'GET', {}, query);

export const userConnection = (userId) => callAPI(`${urls.userConnection}/${userId}`, 'GET');

export const createComment = (postId, data) => callAPI(`${urls.comment}/${postId}`, 'POST', {}, {}, data);

export const deleteCommentPost = (commentId) => callAPI(`${urls.comment}/${commentId}`, 'DELETE');

export const deletePost = (postId) => callAPI(`${urls.post}/${postId}`, 'DELETE');

export const myGroup = () => callAPI(urls.myGroup, 'GET');

export const addGroup = (data) => callAPI(urls.addGroup, 'POST', {}, {}, data);

export const leaveGroup = (groupId) => callAPI(`${urls.leaveGroup}/${groupId}`, 'DELETE');

export const removeGroup = (groupId) => callAPI(`${urls.removeGroup}/${groupId}`, 'DELETE');

export const updateGroup = (groupId, data) => callAPI(`${urls.updateGroup}/${groupId}`, 'PATCH', {}, {}, data);

export const deleteMember = (userId, groupId) => callAPI(`${urls.deleteMember}/${userId}/${groupId}`, 'PATCH');

export const createDestination = (data) => callAPI(urls.destination, 'POST', headersMultipart, {}, data);

export const getDestination = () => callAPI(urls.destination, 'GET');

export const getDestinationById = (destinationId) => callAPI(`${urls.destination}/${destinationId}`, 'GET');

export const editDestination = (destinationId, data) =>
  callAPI(`${urls.destination}/${destinationId}`, 'PATCH', headersMultipart, {}, data);

export const deleteDestination = (destinationId) => callAPI(`${urls.destination}/${destinationId}`, 'DELETE');

export const dashboard = () => callAPI(urls.dashboard, 'GET');

export const myFollow = () => callAPI(urls.myFollow, 'GET');

export const userFollow = (userId) => callAPI(`${urls.userFollow}/${userId}`, 'GET');

export const deleteFollower = (followId) => callAPI(`${urls.myFollow}/${followId}`, 'DELETE');

export const nearbyDirection = () => callAPI(urls.nearbyDirection, 'GET');
