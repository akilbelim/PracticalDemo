using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TemplareImplement.Helper;
using TemplareImplement.Models;

namespace TemplareImplement.Repository
{
    public class UserMaster : IUserMaster
    {
        ISqlHelper _SqlHelper;
        public UserMaster(ISqlHelper _ISqlHelper)
        {
            _SqlHelper = _ISqlHelper;
        }
        public MEMBERS.SQLReturnValue GetUserMasterData(UserMasterModel obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "QueryID", obj.QueryID }, { "Offset", obj.Offset }, { "Limit", obj.Limit }, { "SortColumn", obj.SortColumn }, { "SearchText", obj.SearchText } };
            return _SqlHelper.ExecuteProcedureGetDetails("UserMaster_SP", param);
        }
        public MEMBERS.SQLReturnValue UpdateUserMasterData(UserMasterModel obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "Name", obj.Name }, { "LoginId", obj.LoginId }, { "CreatedBy", obj.CreatedBy }, { "QueryID", obj.QueryID } };
            return _SqlHelper.ExecuteProceduerWithMessage("UserMaster_SP", param, true);
        }
        public MEMBERS.SQLReturnValue InsertUserMasterData(UserMasterModel obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "Name", obj.Name }, { "LoginId", obj.LoginId }, { "Pass", obj.Pass }, { "CreatedBy", obj.CreatedBy }, { "QueryID", obj.QueryID } };
            return _SqlHelper.ExecuteProceduerWithMessage("UserMaster_SP", param, true);
        }
        public MEMBERS.SQLReturnValue DeleteUserMasterData(UserMasterModel obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "IsActive", obj.IsActive }, { "CreatedBy", obj.CreatedBy }, { "QueryID", obj.QueryID } };
            return _SqlHelper.ExecuteProceduerWithMessage("UserMaster_SP", param, true);
        }
        public MEMBERS.SQLReturnValue GetUserMasterDataWithPaging(UserMasterModel obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "QueryID", obj.QueryID }, { "Offset", obj.Offset }, { "Limit", obj.Limit }, { "SortColumn", obj.SortColumn }, { "SearchText", obj.SearchText } };
            return _SqlHelper.ExecuteProcedureGetDetails("UserMaster_SP", param);
        }

        public MEMBERS.SQLReturnValue DeleteUserMasterData(UserMasterMdl obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "QueryID", obj.QueryID } };
            return _SqlHelper.ExecuteProceduerWithMessage("UserMasterNew_SP", param, true);
        }

        public MEMBERS.SQLReturnValue GetUserMasterData(UserMasterMdl obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "QueryID", obj.QueryID } };
            return _SqlHelper.ExecuteProcedureGetDetails("UserMasterNew_SP", param);
        }

        public MEMBERS.SQLReturnValue GetUserMasterDataWithPaging(UserMasterMdl obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "QueryID", obj.QueryID }, { "Offset", obj.Offset }, { "Limit", obj.Limit }, { "SortColumn", obj.SortColumn }, { "SearchText", obj.SearchText } };
            return _SqlHelper.ExecuteProcedureGetDetails("UserMasterNew_SP", param);
        }

        public MEMBERS.SQLReturnValue InsertUserMasterData(UserMasterMdl obj)
        {
            string[,] param = { { "UserID", obj.UserID }, { "FirstName", obj.FirstName }, { "LastNamme", obj.LastNamme }, { "EmailId", obj.EmailId }, { "UserAddress", obj.UserAddress }, { "DateofBirth", obj.DateofBirth }, { "QueryID", obj.QueryID } };
            return _SqlHelper.ExecuteProceduerWithMessage("UserMasterNew_SP", param, true);
        }

        public MEMBERS.SQLReturnValue InsertUserMasterDataAPI(UserMasterMdl obj)
        {
            throw new NotImplementedException();
        }
    }
}
