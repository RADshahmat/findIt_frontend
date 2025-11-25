import { configureStore } from '@reduxjs/toolkit';
import catagoryReducer from '../features/catagory/catagory.jsx';
import authReducer from '../features/auth/authSlice.jsx';
import postReducer from '../features/posts/post.jsx';
import locationReducer from '../features/location/location.jsx';
import fetchPostReducer  from '../features/posts/fetchPost.jsx';
import fetchPostHomeReducer from '../features/posts/fetchPostHome.jsx';
import reportsReducer from "../features/reports/reportsSlice"
import matchesReducer from '../features/matching/matching.jsx';
import searchReducer from '../features/search/searchSlice.jsx';
import verificationReducer from "../features/verification/verificationSlice";
import claimReducer from '../features/claim/claimSlice';
import matchedLostPostReducer from '../features/posts/getsinglepostSlice';
import myListingsReducer from '../features/mylistings/myListingsSlice.js';
import postActivenessFlagReducer from '../features/posts/postActivenessFlagSlice.js';
import peopleReducer from '../features/posts/fetchPeoplePosts.jsx';
import reporttoadminReducer from '../features/reportToAdmin/reporttoadmin.js';
import donationsReducer from '../features/reportToAdmin/donationSlice.js';

export const store = configureStore({
  reducer: {
    catagory: catagoryReducer,
    auth: authReducer,
    post: postReducer,
    people: peopleReducer,
    location: locationReducer,
    fetchPost: fetchPostReducer,
    fetchPostHome: fetchPostHomeReducer,
    reports: reportsReducer,
    matches: matchesReducer,
    search: searchReducer,
    verification: verificationReducer,
    claims: claimReducer,
    singlepost: matchedLostPostReducer,
    myListings: myListingsReducer,
    postActivenessFlag: postActivenessFlagReducer,
    reporttoadmin: reporttoadminReducer,
    donations: donationsReducer,
  },
});
