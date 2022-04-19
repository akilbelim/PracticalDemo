//---------------------------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated by T4Model template for T4 (https://github.com/linq2db/linq2db).
//    Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
// </auto-generated>
//---------------------------------------------------------------------------------------------------

#pragma warning disable 1572, 1591

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;

using LinqToDB;
using LinqToDB.Common;
using LinqToDB.Configuration;
using LinqToDB.Data;
using LinqToDB.Mapping;

namespace DataModels
{
	/// <summary>
	/// Database       : CsProjDB
	/// Data Source    : DESKTOP-LSMINBF\SQLEXPRESS
	/// Server Version : 12.00.2000
	/// </summary>
	public partial class CsProjDBDB : LinqToDB.Data.DataConnection
	{
		public ITable<UserMasterNew> UserMasterNews { get { return this.GetTable<UserMasterNew>(); } }

		public CsProjDBDB()
		{
			InitDataContext();
			InitMappingSchema();
		}

		public CsProjDBDB(string configuration)
			: base(configuration)
		{
			InitDataContext();
			InitMappingSchema();
		}

		public CsProjDBDB(object connectionString, LinqToDbConnectionOptions options)
			: base(options)
		{
			InitDataContext();
			InitMappingSchema();
		}

		public CsProjDBDB(LinqToDbConnectionOptions<CsProjDBDB> options)
			: base(options)
		{
			InitDataContext();
			InitMappingSchema();
		}

		partial void InitDataContext  ();
		partial void InitMappingSchema();

		#region Table Functions

		#region SplitString

		[Sql.TableFunction(Schema="dbo", Name="SplitString")]
		public ITable<SplitStringResult> SplitString(string @String, char? @Delimiter)
		{
			return this.GetTable<SplitStringResult>(this, (MethodInfo)MethodBase.GetCurrentMethod(),
				@String,
				@Delimiter);
		}

		public partial class SplitStringResult
		{
			public long?  Id    { get; set; }
			public string Value { get; set; }
		}

		#endregion

		#endregion
	}

	[Table(Schema="dbo", Name="UserMasterNew")]
	public partial class UserMasterNew
	{
		[PrimaryKey, Identity] public int       UserID      { get; set; } // int
		[Column,     Nullable] public string    FirstName   { get; set; } // nvarchar(25)
		[Column,     Nullable] public string    LastNamme   { get; set; } // nvarchar(25)
		[Column,     Nullable] public string    EmailId     { get; set; } // nvarchar(25)
		[Column,     Nullable] public string    UserAddress { get; set; } // nvarchar(max)
		[Column,     Nullable] public DateTime? DateofBirth { get; set; } // datetime
	}

	public static partial class CsProjDBDBStoredProcedures
	{
		#region UserMasterNewSp

		public static IEnumerable<UserMasterNew> UserMasterNewSp(this CsProjDBDB dataConnection, int? @UserID, string @FirstName, string @LastNamme, string @EmailId, string @UserAddress, DateTime? @DateofBirth, int? @QueryID, int? @Offset, int? @Limit, string @SortColumn, string @SearchText, ref int? @OUTVAL, ref string @OUTMESSAGE)
		{
			var ret = dataConnection.QueryProc<UserMasterNew>("[dbo].[UserMasterNew_SP]",
				new DataParameter("@UserID",     @UserID,     LinqToDB.DataType.Int32),
				new DataParameter("@FirstName",  @FirstName,  LinqToDB.DataType.NVarChar),
				new DataParameter("@LastNamme",  @LastNamme,  LinqToDB.DataType.NVarChar),
				new DataParameter("@EmailId",    @EmailId,    LinqToDB.DataType.NVarChar),
				new DataParameter("@UserAddress", @UserAddress, LinqToDB.DataType.NVarChar),
				new DataParameter("@DateofBirth", @DateofBirth, LinqToDB.DataType.DateTime),
				new DataParameter("@QueryID",    @QueryID,    LinqToDB.DataType.Int32),
				new DataParameter("@Offset",     @Offset,     LinqToDB.DataType.Int32),
				new DataParameter("@Limit",      @Limit,      LinqToDB.DataType.Int32),
				new DataParameter("@SortColumn", @SortColumn, LinqToDB.DataType.NVarChar),
				new DataParameter("@SearchText", @SearchText, LinqToDB.DataType.NVarChar),
				new DataParameter("@OUTVAL",     @OUTVAL,     LinqToDB.DataType.Int32) { Direction = ParameterDirection.InputOutput },
				new DataParameter("@OUTMESSAGE", @OUTMESSAGE, LinqToDB.DataType.NVarChar) { Direction = ParameterDirection.InputOutput, Size = 200 }).ToList();

			@OUTVAL     = Converter.ChangeTypeTo<int?>  (((IDbDataParameter)dataConnection.Command.Parameters["@OUTVAL"]).    Value);
			@OUTMESSAGE = Converter.ChangeTypeTo<string>(((IDbDataParameter)dataConnection.Command.Parameters["@OUTMESSAGE"]).Value);

			return ret;
		}

		#endregion
	}

	public static partial class TableExtensions
	{
		public static UserMasterNew Find(this ITable<UserMasterNew> table, int UserID)
		{
			return table.FirstOrDefault(t =>
				t.UserID == UserID);
		}
	}
}