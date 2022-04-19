using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TemplareImplement.Models
{
    public class UserMasterModel
	{
		public string UserID { get; set; }
		[Required(ErrorMessage = "Please enter user name")]
		public string Name { get; set; }
		[Required(ErrorMessage = "Please enter login id")]
		public string LoginId { get; set; }
		[Required(ErrorMessage = "Please enter password")]
		public string Pass { get; set; }
		public string IsActive { get; set; }
		public string CreatedBy { get; set; }
		public string CreatedDate { get; set; }
		public string UpdatedBy { get; set; }
		public string UpdatedDate { get; set; }
		public string QueryID { get; set; }
		public string Offset { get; set; }
		public string Limit { get; set; }
		public string SortColumn { get; set; }
		public string SearchText { get; set; }
	}
}
