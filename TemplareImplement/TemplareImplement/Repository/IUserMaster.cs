using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TemplareImplement.Models;

namespace TemplareImplement.Repository
{
    public interface IUserMaster
    {
        public MEMBERS.SQLReturnValue InsertUserMasterData(UserMasterModel obj);
        public MEMBERS.SQLReturnValue UpdateUserMasterData(UserMasterModel obj);
        public MEMBERS.SQLReturnValue DeleteUserMasterData(UserMasterModel obj);
        public MEMBERS.SQLReturnValue GetUserMasterData(UserMasterModel obj);
        public MEMBERS.SQLReturnValue GetUserMasterDataWithPaging(UserMasterModel obj);

        public MEMBERS.SQLReturnValue InsertUserMasterData(UserMasterMdl obj);
        public MEMBERS.SQLReturnValue InsertUserMasterDataAPI(UserMasterMdl obj);
        public MEMBERS.SQLReturnValue DeleteUserMasterData(UserMasterMdl obj);
        public MEMBERS.SQLReturnValue GetUserMasterData(UserMasterMdl obj);
        public MEMBERS.SQLReturnValue GetUserMasterDataWithPaging(UserMasterMdl obj);
    }
}
