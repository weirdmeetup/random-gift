var bindActionCreators = require('redux').bindActionCreators;

var connect = require('react-redux').connect;

var loadApplicants = require('../actions/actions').loadApplicants;

var CSVUploader = require('../components/CSVUploader');

function mapStateToProps(state) {
    return {
        applicants: state.applicants
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadApplicants: bindActionCreators(loadApplicants, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(CSVUploader);
