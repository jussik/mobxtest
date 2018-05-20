using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.DependencyInjection;

namespace Mobxtest
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
				app.UseWebpackDevMiddleware();
            }

	        app.UseRewriter(new RewriteOptions()
		        .AddRewrite("^dist/", "$1", true)
		        .AddRewrite(".*", "dist/index.html", true));
			app.UseStaticFiles();
        }
    }
}
