using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TemplareImplement.Models
{
    public class UserMasterMdl
    {
        public string UserID { get; set; }
        public string FirstName { get; set; }
        public string LastNamme { get; set; }
        public string EmailId { get; set; }
        public string UserAddress { get; set; }
        public string DateofBirth { get; set; }
        public string QueryID { get; set; }
        public string Offset { get; set; }
        public string Limit { get; set; }
        public string SortColumn { get; set; }
        public string SearchText { get; set; }
    }
}
