import Route from 'found/Route';
import makeRouteConfig from 'found/makeRouteConfig';
import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import graphql from 'babel-plugin-relay/macro';
import RedirectException from 'found/RedirectException';
import AppRoot from '../components/AppRoot/AppRoot';
import SignIn from '../components/Authentication/SignIn/SignIn';
import SignInOptions from '../components/Authentication/SignInOptions/SignInOptions';
import SignUpOptions from '../components/Authentication/SignUpOptions/SignUpOptions';
import SignupWithEmail from '../components/Authentication/SignUp/SignupWithEmail';
import ForgotPassword from '../components/Authentication/ForgotPassword/ForgotPassword';
import TermsAndPrivacy from '../components/Policies/TermsAndPrivacy';
import Support from '../components/Policies/Support';
import Guide from '../components/LandingPage/Guide';
import PageNotFound from '../components/PageNotFound';
import Loading from '../components/Loading/Loading';
import VourtsaEditor from '../components/VourtsaEditor/Editor/VourtsaEditor';
import SalesRefund from '../components/Policies/SalesRefund';
import Contacts from '../components/Dashboard/HubSection/Contacts/Contacts';
import Home from '../components/Dashboard/HubSection/Home/Home';
import AccountMain from '../components/Dashboard/HubSection/Account/AccountMain';

const RoutesAppRootQuery = graphql`
  query routes_AppRoot_Query($uuid: String!) {
    user(uuid: $uuid) {
      ...Dashboard_user
    }
  }
`;
export default makeRouteConfig(
  <Route>
    <Route path="/" Component={SignIn} />
    <Route path="/app">
      <Route
        Component={AppRoot}
        query={RoutesAppRootQuery}
        render={({ props, error, resolving }) => {
          if (error && resolving) {
            throw new RedirectException('/');
          }
          if (props) {
            const { match, router, user } = props;
            return <AppRoot match={match} router={router} user={user} />;
          }
          return <Loading />;
        }}
        fetchPolicy="store-and-network"
        prepareVariables={(params) => {
          const uuid = firebase.auth().currentUser?.uid;
          return {
            ...params,
            uuid,
          };
        }}
      >
        <Route path="account" Component={AccountMain} />
        <Route path="contacts" Component={Contacts} />
        <Route path="home" Component={Home} />
      </Route>
    </Route>
    <Route path="/vourtsa-editor" Component={VourtsaEditor} />
    <Route path="/terms-privacy" Component={TermsAndPrivacy} />
    <Route path="/support" Component={Support} />
    <Route path="/sales-refund" Component={SalesRefund} />
    <Route path="/guide" Component={Guide} />
    <Route path="/*" Component={PageNotFound} />
    <Route path="/create-account-options" Component={SignUpOptions} />
    <Route path="/create-account-email" Component={SignupWithEmail} />
    <Route path="/forgot-password" Component={ForgotPassword} />
    <Route path="/login-options" Component={SignInOptions} />
  </Route>,
);
