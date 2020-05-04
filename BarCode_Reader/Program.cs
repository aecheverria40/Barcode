using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
//Added
using Microsoft.AspNetCore;
using System.IO;

namespace BarCode_Reader
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
            //CreateWebHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
        // public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        // WebHost.CreateDefaultBuilder(args)
        //     .UseUrls("https://192.168.1.77:5566")
        //     .UseContentRoot(Directory.GetCurrentDirectory())
        //     .UseIISIntegration()
        //     .UseStartup<Startup>();
    }
}
